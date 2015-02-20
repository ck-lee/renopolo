var cks = cks || {};
cks.viewModels = cks.viewModels || {};
cks.viewModels.post = function (planningVm, traceEstimateVm, wallsVm, projectEntity, loginVm, tracer, geoLocation, resultsVm) {
    var _observablesWithValidation = ko.observableArray();
    var _checkAllFieldsAreValid = function () {
        return cks.validations.checkFieldsAreValid(_observablesWithValidation);
    };

    var _checkStep2FieldsAreValid = function () {
        var _observablesWithValidationStep2 = ko.observableArray([
            wallsVm.height,
            traceEstimateVm.pseudoTraceWall,
            traceEstimateVm.lastFloorPlanSelection
        ]);
        return cks.validations.checkFieldsAreValid(_observablesWithValidationStep2);
    };

    var _isLoading = ko.observable(false);
    var _isStep1Complete = ko.observable(false);
    var _isStep2Complete = ko.observable(false);
    var _isStep3Complete = ko.observable(false);
    var _isStep4Complete = ko.observable(false);
    var _isStep1Enabled = ko.observable(true);
    var _isStep2Enabled = ko.observable(false);
    var _isStep3Enabled = ko.observable(false);
    var _isStep4Enabled = ko.observable(false);
    var _currentStep = ko.observable();
    var _selectedCalculation = ko.observable();

    var _notifyIfNotSignedIn = function () {
        if (loginVm.userIsSignedIn() === false) {
            $.pnotify({
                title: 'Project is not saved.',
                text: "Please sign in to save your project",
                type: 'alert'
            });
        }
    };

    var _processFromStep1ToStep2 = function () {
        _isLoading(true);
        window.location.href = "/#!/post/step2";
        _backButtonIsVisible(true);
        _contineButtonIsVisible(true);
        _isStep1Complete(true);
        _isStep2Enabled(true);
        _isLoading(false);
        var _service = cks.services.ajax({
            url: "/api/account/cookie/",
            type: "post",
            data: {country: geoLocation.getCurrentCountry() }
        });
        _service.error(function() {
            $.pnotify({
                title: 'Oops',
                text: 'Your changes might not be saved.',
                type: 'error'
            });
        });
    };
    var _wallAreaClicked = function () {
        _selectedCalculation("WallArea");
        traceEstimateVm.floorPlanQuestion("3. Do you have a floorplan?");
        _processFromStep1ToStep2();
    };
    
    var _floorAreaClicked = function () {
        _selectedCalculation("FloorArea");
        traceEstimateVm.floorPlanQuestion("2. How would you like to trace floor?");
        _processFromStep1ToStep2();
    };

    var _step2ContinueClicked = function () {
        if (_checkStep2FieldsAreValid() !== true)
            return;
        _isLoading(true);
        window.location.hash = "#!/post/step3";
        _backButtonIsVisible(true);
        _isStep2Complete(true);
        _isStep3Enabled(true);
        _isLoading(false);
        var _projectJs = projectEntity.toJs();
        var _service = cks.services.ajax({
            url: "/api/plan/section/",
            type: "post",
            data: { project: _projectJs }
        });
        _service.error(function () {
            $.pnotify({
                title: 'Oops',
                text: 'Your changes might not be saved.',
                type: 'error'
            });
        }).success(function (response) {
            wallsVm.sectionId(response.sectionId);
        });
    };
    var _step2BackClicked = function () {
        window.location.href = "/#!/post/step1";
        _contineButtonIsVisible(false);
        _backButtonIsVisible(false);
    };
    var _step3ContinueClicked = function () {
        _isLoading(true);
        window.location.href = "/#!/post/step4";
        _notifyIfNotSignedIn();
        _backButtonIsVisible(true);
        _contineButtonIsVisible(false);
        _isStep3Complete(true);
        _isStep4Enabled(true);
        _isLoading(false);
        var _projectJs = projectEntity.toJs();
        var _service = cks.services.ajax({
            url: "/api/plan/adjustments/",
            type: "put",
            data: { project: _projectJs }
        });
        _service.error(function () {
            $.pnotify({
                title: 'Oops',
                text: 'Your changes might not be saved.',
                type: 'error'
            });
        });
    };
    var _step3BackClicked = function () {
        window.location.href = "/#!/post/step2";
    };
    var _step4ContinueClicked = function () {
        if (_checkAllFieldsAreValid() === false) {
            return;
        }
        _isLoading(true);
        _notifyIfNotSignedIn();
        var _projectJs = projectEntity.toJs();
        var _service = cks.services.ajax({
            url: "/api/plan/project/",
            type: "put",
            data: { project: _projectJs }
        }
        );
        _service.success(function () {
            $.pnotify({
                title: 'Woohoo',
                text: 'Project ' + _projectJs.title + ' is saved',
                type: 'success',
                hide: false
            });
        }).error(function () {
            $.pnotify({
                title: 'Oops',
                text: 'We are not able to save your project.  Please try again later',
                type: 'error'
            });
        });
    };
    var _step4BackClicked = function () {
        window.location.href = "/#!/post/step3";
        _contineButtonIsVisible(true);
        _backButtonIsVisible(true);
    };
    var _contineButtonIsVisible = ko.observable(false);
    var _backButtonIsVisible = ko.observable(false);
    var _continueClicked = function () {
        if (window.location.hash == "#!/post/step2") {
            _step2ContinueClicked();
        }
        else if (window.location.hash == "#!/post/step3") {
            _step3ContinueClicked();
        }
        else if (window.location.hash == "#!/post/step4") {
            _step4ContinueClicked();
        }
    };
    var _backClicked = function () {
        if (window.location.hash == "#!/post/step2") {            
            _step2BackClicked();
            _backButtonIsVisible(false);
        }
        else if (window.location.hash == "#!/post/step3") {
            _step3BackClicked();
        }
        else if (window.location.hash == "#!/post/step4") {
            _step4BackClicked();
        }

    };
    var _step1Clicked = function () {
        if (_isStep1Enabled() === true) {
            _backButtonIsVisible(false);
            _contineButtonIsVisible(false);
            window.location.href = "/#!/post/step1";
        }
    };
    var _step2Clicked = function () {
        if (_isStep2Enabled() === true) {
            _backButtonIsVisible(true);
            _contineButtonIsVisible(true);
            window.location.href = "/#!/post/step2";
        }
    };
    var _step3Clicked = function () {
        if (_isStep3Enabled() === true) {
            _backButtonIsVisible(true);
            _contineButtonIsVisible(true);

            window.location.href = "/#!/post/step3";
        }
        
    };
    var _step4Clicked = function () {
        if (_isStep4Enabled() === true) {
            _backButtonIsVisible(true);
            _contineButtonIsVisible(false);
            window.location.href = "/#!/post/step4";
        }
        
    };

    var _redrawObjectsInTracer = function () {
        var _deferred = new $.Deferred();
        var _promise;
        var _drawTracer = function () {
            if (traceEstimateVm.lastFloorPlanSelection() === "sampleFloorPlan") {
                _promise = tracer.loadSampleBackground();

            } else if (traceEstimateVm.lastFloorPlanSelection() === "withoutFloorPlan") {
                _promise = tracer.loadBlankBackground();
            } else {
                _promise = tracer.loadUserBackground(traceEstimateVm.floorPlanUrl());
            }
            _promise.then(function () {
                _.each(traceEstimateVm.walls(), function (wall) {
                    tracer.drawWall(wall);
                });
                if (planningVm.unitsSystem() === "Imperial") {
                    $("#plan-step2").find("a.btn:contains('Imperial')").addClass("active");
                    $("#plan-step2").find("a.btn:contains('Metric')").removeClass("active");
                } else {
                    $("#plan-step2").find("a.btn:contains('Metric')").addClass("active");
                    $("#plan-step2").find("a.btn:contains('Imperial')").removeClass("active");
                }
                _deferred.resolve();
            });
        };
        if (tracer.isCanvasCreated() === true) {
            _drawTracer();
        } else {
            //one time subscription to wait for canvas to finish initialization
            var _subscription = tracer.isCanvasCreated.subscribe(function (newValue) { 
                if (newValue === false)
                    return;
                _subscription.dispose();
                _drawTracer();
            });
        }        
        return _deferred.promise();
    };

    var _checkForStep1ToInitialize = function () {
        var _deferred = new $.Deferred();
        if (window.location.href.indexOf("post") < 0) {
            window.location.href = "/#!/post/step1";
            _deferred.resolve();
        } else {
            _deferred.resolve();
        }
        return _deferred.promise();
    };

    var _redrawFloorPlan = function () {
        cks.transitions.loadingOn();
        _checkForStep1ToInitialize().then(_redrawObjectsInTracer).then(function () {
            setTimeout(function () {
                window.location.href = "/#!/post/step2";
                cks.transitions.loadingOff();
            }, 1500);
        });
        traceEstimateVm.tracerSectionIsVisible(true);
        _backButtonIsVisible(true);
        _contineButtonIsVisible(true);
        _isStep1Complete(true);
        _isStep2Enabled(true);
        traceEstimateVm.resetFloorPlanActiveClass(traceEstimateVm.lastFloorPlanSelection());

    };
    
    var _toJs = function () {
        return { project:
            {
                title: planningVm.title(),
            }
        };
    };
    return {
        isLoading: _isLoading,
        step2ContinueClicked: _step2ContinueClicked,
        isStep1Complete: _isStep1Complete,
        isStep2Complete: _isStep2Complete,
        isStep3Complete: _isStep3Complete,
        isStep4Complete: _isStep4Complete,
        isStep1Enabled: _isStep1Enabled,
        isStep2Enabled: _isStep2Enabled,
        isStep3Enabled: _isStep3Enabled,
        isStep4Enabled: _isStep4Enabled,
        currentStep: _currentStep,
        step2BackClicked: _step2BackClicked,
        step1Clicked: _step1Clicked,
        step2Clicked: _step2Clicked,
        step3Clicked: _step3Clicked,
        step4Clicked: _step4Clicked,
        continueClicked: _continueClicked,
        contineButtonIsVisible: _contineButtonIsVisible,
        backClicked: _backClicked,
        backButtonIsVisible: _backButtonIsVisible,
        wallsVm: wallsVm,
        planningVm: planningVm,
        traceEstimateVm: traceEstimateVm,
        wallAreaClicked: _wallAreaClicked,
        floorAreaClicked: _floorAreaClicked,
        resultsVm: resultsVm,
        tracer: tracer,
        redrawFloorPlan: _redrawFloorPlan,
        toJs: _toJs
    };
};