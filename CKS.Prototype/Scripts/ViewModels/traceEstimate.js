var cks = cks || {};
cks.viewModels = cks.viewModels || {};
cks.viewModels.traceEstimate = function (tracer, planningVm, wallsVm) {
    var _observablesWithValidation = ko.observableArray();

    var _floorPlanQuestion = ko.observable("3. Do you have a floorplan?");

    var _measurements = cks.measurements();

    var _wallLengthInCmRatio = function (x1, y1, x2, y2) {
        return _measurements.calculateActualLengthRatio(wallsVm.firstWallLengthInCm(), x1, y1, x2, y2);
    };
    
    var _walls = ko.observable([]);

    var _calculateLengthFromPixel = function (x1, y1, x2, y2) {
        if (_walls().length < 1)
            return;
        var _distanceInPixel = _measurements.calculateDistance(x1, y1, x2, y2);
        var _firstWall = _walls()[0];
        var _actualLength = _distanceInPixel * _wallLengthInCmRatio(_firstWall.startPoint.x, _firstWall.startPoint.y, _firstWall.endPoint.x, _firstWall.endPoint.y);
        return _actualLength;
    };
    
    var _calculateLengthInCmFromPixel = function (x1, y1, x2, y2) {
        if (_walls().length < 1)
            return;
        var _distanceInPixel = _measurements.calculateDistance(x1, y1, x2, y2);
        var _firstWall = _walls()[0];
        var _result = _distanceInPixel * _wallLengthInCmRatio(_firstWall.startPoint.x, _firstWall.startPoint.y, _firstWall.endPoint.x, _firstWall.endPoint.y);
        return _result;
    };

    var _calculatedWalls = ko.computed(function () {
        if (!_walls())
            return;
        var _results = [];
        var _heightInCm = wallsVm.heightInCm();
        _.each(_walls(), function (wall, index) {
            var _lengthInCm = _calculateLengthInCmFromPixel(wall.startPoint.x, wall.startPoint.y, wall.endPoint.x, wall.endPoint.y);
            var _lengthInFt = _measurements.convertCmToFt(_lengthInCm);
            var _areaInSqCm = _measurements.calculateArea(_lengthInCm, _heightInCm);
            var _areaInSqM = _measurements.convertSqCmToSqM(_areaInSqCm);
            var _areaInSqFt = _measurements.convertSqCmToSqFt(_areaInSqCm);
            var _displayLength = _measurements.getMeasurementInDisplay(_lengthInCm, planningVm.unitsSystem());
            var _displayArea = _measurements.getAreaInDisplay(_areaInSqCm, planningVm.unitsSystem());
            var _result = {
                "length": { "display": _displayLength, "cm": _lengthInCm, "ft": _lengthInFt },
                "area": { "display": _displayArea, "sqCm": _areaInSqCm, "sqFt": _areaInSqFt, "sqM": _areaInSqM },
                "points": { "startPoint": wall.startPoint, "endPoint": wall.endPoint },
                "wallType": wall.wallType,
                "id": wall.id
            };
            _results.push(_result);

        });
        return _results;
    });

    tracer.onMouseClick(function (startPoint, endPoint, walls, isFirstWall, isFirstClick) {
        _walls(walls);
        if (isFirstWall === false && isFirstClick === false) {
            tracer.popoverText(undefined);
        }
    });

    tracer.onMouseMove(function (startPoint, endPoint, isFirstWall) {
        if (isFirstWall === false) {
            var _length = _calculateLengthFromPixel(startPoint.x, startPoint.y, endPoint.x, endPoint.y, planningVm.unitsSystem());
            tracer.popoverText(_measurements.getMeasurementInDisplay(_length, planningVm.unitsSystem()));
        }
    });
    
    var _tracerSectionIsVisible = ko.observable(false);

    var _wallSectionIsVisible = ko.observable(false);
    
    var _continueFloorplanCallback;
    
    var _lastFloorPlanSelection = ko.observable();
    
    var _uploadFloorPlanSectionIsVisible = ko.computed(function () {
        return _lastFloorPlanSelection() === "uploadFloorPlan";
    });

    var _resetFloorPlanActiveClass = function (value) {
        $("#uploadFloorPlan").removeClass("active");
        $("#withoutFloorPlan").removeClass("active");
        $("#sampleFloorPlan").removeClass("active");
        if (value) {
            $("#" + value).addClass("active");
        }
    };
  
    var _floorplanAlert = function (callback) {
        if (_walls().length > 0) {
            $("#floorplanAlert").show();
            _continueFloorplanCallback = callback;
        } else {
            callback();
        }
    };
    
    var _isUploadingFloorPlan = ko.observable(false);
    var _floorPlanIsUploaded = ko.observable(false);
    var _floorPlanUrl = ko.observable();

    var _uploadFloorPlanClicked = function () {
        wallsVm.height.isTriggered(true);
        if (wallsVm.height.isValid() !== true) {
            _resetFloorPlanActiveClass();
            return;
        }
        _floorplanAlert(function () {
            if (_floorPlanIsUploaded() !== true && !_floorPlanUrl()) {
                _wallSectionIsVisible(false);
                _tracerSectionIsVisible(false);
                _floorPlanUrl(undefined);
            }
            else {
                tracer.loadUserBackground(_floorPlanUrl()).done(function () {
                        _wallSectionIsVisible(true);
                        _tracerSectionIsVisible(false);
                        _isUploadingFloorPlan(false);
                        _floorPlanIsUploaded(true);
                    });
            }
            _lastFloorPlanSelection("uploadFloorPlan");
            _walls([]);
            tracer.walls([]);
            //TODO: remove this IF NOT NEEDED
            //wallsVm.sectionId(undefined);
            _resetFloorPlanActiveClass(_lastFloorPlanSelection());
        });
    };

    var _animateWallTypePopOverDisplay = function() {
        if (_wallTypePopOverIsVisible() === undefined) {
            setTimeout(function() {
                _wallTypePopOverIsVisible(true);
            }, 1000);
        }
    };

    var _withoutFloorPlanClicked = function () {
        wallsVm.height.isTriggered(true);
        if (wallsVm.height.isValid() !== true) {
            _resetFloorPlanActiveClass();
            return;
        }
        _animateWallTypePopOverDisplay();
        _floorplanAlert(function () {
            tracer.loadBlankBackground();
            _tracerSectionIsVisible(false);
            _wallSectionIsVisible(true);
            _lastFloorPlanSelection("withoutFloorPlan");
            _walls([]);
            tracer.walls([]);
            wallsVm.sectionId(undefined);
            _resetFloorPlanActiveClass(_lastFloorPlanSelection());
        });
    };
    
    var _sampleFloorPlanClicked = function () {
        wallsVm.height.isTriggered(true);
        if (wallsVm.height.isValid() !== true) {
            _resetFloorPlanActiveClass();
            return;
        }
        _animateWallTypePopOverDisplay();
        _floorplanAlert(function () {
            tracer.loadSampleBackground();
            _tracerSectionIsVisible(false);
            _wallSectionIsVisible(true);
            _lastFloorPlanSelection("sampleFloorPlan");
            _walls([]);
            tracer.walls([]);
            wallsVm.sectionId(undefined);
            _resetFloorPlanActiveClass(_lastFloorPlanSelection());
        });
    };

    var _continueFloorPlanAlertClicked = function () {
        $("#floorplanAlert").hide();
        _continueFloorplanCallback();
        _resetFloorPlanActiveClass(_lastFloorPlanSelection());
    };
    
    var _cancelFloorPlanAlertClicked = function () {
        $("#floorplanAlert").hide();
        _resetFloorPlanActiveClass(_lastFloorPlanSelection());
    };

    var _exteriorWallClicked = function () {
        tracer.isConnecting(true);
        tracer.popoverText("Click to start tracing walls");
        _wallTypePopOverIsVisible(false);
        _tracerSectionIsVisible(true);
    };

    var _wallTypePopOverIsVisible = ko.observable();

    var _internalWallClicked = function () {
        tracer.isConnecting(false);
        tracer.popoverText("Click to start tracing walls");
        _wallTypePopOverIsVisible(false);
        _tracerSectionIsVisible(true);
    };

    var _internalWalls = ko.computed(function () {
        var _filteredWalls = _.filter(_calculatedWalls(), function(wall) {
            return wall.wallType == "Internal";
        });
        return _filteredWalls;
    });
    
    var _exteriorWalls = ko.computed(function () {
        var _filteredWalls = _.filter(_calculatedWalls(), function (wall) {
            return wall.wallType == "Exterior";
        });
        return _filteredWalls;
    });

    var _wallsGrossMeasuredAreaDisplay = function (walls) {
        if (!walls || walls.length === 0)
            return _measurements.getAreaInDisplay(0, planningVm.unitsSystem());
        var _totalAreaSqCm = 0;
        _.each(walls, function (wall) {
            _totalAreaSqCm = _totalAreaSqCm + wall.area.sqCm;
        });

        var _displayText = _measurements.getAreaInDisplay(_totalAreaSqCm, planningVm.unitsSystem());
        return _displayText;
    };

    var _exteriorWallNetTotalAreaSqCm = ko.computed(function () {
        if (!_exteriorWalls() || _exteriorWalls().length === 0)
            return 0;
        var _totalAreaSqCm = 0;
        _.each(_exteriorWalls(), function (wall) {
            _totalAreaSqCm = _totalAreaSqCm + wall.area.sqCm;
        });
        var _netTotalAreaSqCm = _totalAreaSqCm - _measurements.convertSqMToSqCm(wallsVm.exteriorAdjustmentsSqM());
        return _netTotalAreaSqCm;
    });

    var _exteriorWallsNetSurfaceAreaDisplay = ko.computed(function () {
        var _displayText = _measurements.getAreaInDisplay(_exteriorWallNetTotalAreaSqCm(), planningVm.unitsSystem());
        if (!_displayText)
            return;
        var _matches = _displayText.match(/(.+?)( m²| sq ft)/);
        var _html = _matches[1] + '<span style="font-size: 0.4em;">' + _matches[2] + '<span>';
        return _html;
    });
    
    var _wallsTotalLengthDisplay = function (walls) {
        if (!walls || walls.length === 0)
            return _measurements.getMeasurementInDisplay(0, planningVm.unitsSystem());
        var _totalLengthCm = 0;
        _.each(walls, function (wall) {
            _totalLengthCm = _totalLengthCm + wall.length.cm;
        });
        return _measurements.getMeasurementInDisplay(_totalLengthCm, planningVm.unitsSystem());
    };

    var _internalWallNetTotalAreaSqCm = ko.computed(function () {
        if (!_internalWalls() || _internalWalls().length === 0)
            return 0;
        var _totalAreaSqCm = 0;
        _.each(_internalWalls(), function (wall) {
            _totalAreaSqCm = _totalAreaSqCm + wall.area.sqCm;
        });
        var _netTotalAreaSqCm = _totalAreaSqCm - _measurements.convertSqMToSqCm(wallsVm.internalAdjustmentsSqM());
        if (wallsVm.doubleSurfaceArea() === true) {
            _netTotalAreaSqCm = _netTotalAreaSqCm * 2;
        }
        return _netTotalAreaSqCm;
    });
    
    var _internalWallsNetSurfaceAreaDisplay = ko.computed(function () {
        var _displayText = _measurements.getAreaInDisplay(_internalWallNetTotalAreaSqCm(), planningVm.unitsSystem());
        if (!_displayText)
            return;
        var _matches = _displayText.match(/(.+?)( m²| sq ft)/);
        var _html = _matches[1] + '<span style="font-size: 0.4em;">' + _matches[2] + '<span>';
        return _html;
    });

    var _interiorWallNetTotalAreaSqCm = ko.computed(function () {
        return _exteriorWallNetTotalAreaSqCm() + _internalWallNetTotalAreaSqCm();
    });

    var _interiorWallsNetSurfaceAreaDisplay = ko.computed(function () {
        var _displayText = _measurements.getAreaInDisplay(_interiorWallNetTotalAreaSqCm(), planningVm.unitsSystem());
        if (!_displayText)
            return;
        var _matches = _displayText.match(/(.+?)( m²| sq ft)/);
        var _html = _matches[1] + '<span style="font-size: 0.4em;">' + _matches[2] + '<span>';
        return _html;
    });

    var _pseudoTraceWall = ko.computed(function () {
        return _internalWalls() && _exteriorWalls();
    });
    
    _pseudoTraceWall.extend({validations: {
            rules: [{ validationFunction: function () { return _internalWalls().length > 0 || _exteriorWalls().length > 0; }, errorMessage: "Please trace walls.", triggerOnly: true }
            ],
            watch: _observablesWithValidation
        }
    });

    _lastFloorPlanSelection.extend({validations: {
            rules: [{ validationFunction: function () { return !!_lastFloorPlanSelection(); }, errorMessage: "Please select one option", triggerOnly: true }
            ],
            watch: _observablesWithValidation
        }
    });

    

    return {
        observablesWithValidation: _observablesWithValidation,
        calculatedWalls: _calculatedWalls,
        floorPlanQuestion: _floorPlanQuestion,
        tracerSectionIsVisible: _tracerSectionIsVisible,
        uploadFloorPlanClicked: _uploadFloorPlanClicked,
        withoutFloorPlanClicked: _withoutFloorPlanClicked,
        sampleFloorPlanClicked: _sampleFloorPlanClicked,
        continueFloorPlanAlertClicked: _continueFloorPlanAlertClicked,
        cancelFloorPlanAlertClicked: _cancelFloorPlanAlertClicked,
        exteriorWallClicked: _exteriorWallClicked,
        internalWallClicked: _internalWallClicked,
        walls: _walls,
        internalWalls: _internalWalls,
        exteriorWalls: _exteriorWalls,
        wallsGrossMeasuredAreaDisplay: _wallsGrossMeasuredAreaDisplay,
        exteriorWallsNetSurfaceAreaDisplay: _exteriorWallsNetSurfaceAreaDisplay,
        wallsTotalLengthDisplay: _wallsTotalLengthDisplay,
        internalWallsNetSurfaceAreaDisplay: _internalWallsNetSurfaceAreaDisplay,
        interiorWallsNetSurfaceAreaDisplay: _interiorWallsNetSurfaceAreaDisplay,
        pseudoTraceWall: _pseudoTraceWall,
        lastFloorPlanSelection: _lastFloorPlanSelection,
        wallTypePopOverIsVisible: _wallTypePopOverIsVisible,
        exteriorWallNetTotalAreaSqCm: _exteriorWallNetTotalAreaSqCm,
        internalWallNetTotalAreaSqCm: _internalWallNetTotalAreaSqCm,
        interiorWallNetTotalAreaSqCm: _interiorWallNetTotalAreaSqCm,
        uploadFloorPlanSectionIsVisible: _uploadFloorPlanSectionIsVisible,
        isUploadingFloorPlan: _isUploadingFloorPlan,
        floorPlanIsUploaded: _floorPlanIsUploaded,
        resetFloorPlanActiveClass: _resetFloorPlanActiveClass,
        floorPlanUrl: _floorPlanUrl,
        wallSectionIsVisible: _wallSectionIsVisible
    };
};