var cks = cks || {};
cks.tracer = function () {
    var _walls = ko.observable([]);
    var _popoverText = ko.observable();
    var _paper;
    var _isFirstClick = true;
    var _isFirstWall = true;
    var _startPoint;
    var _endPoint;
    var _snapToGrid = true;
    var _onMouseClickCallback;
    var _onMouseMoveCallback;
    var _isConnecting = ko.observable();
    var _elements = ko.observableArray();
    var _isCanvasCreated = ko.observable(false);

    var _raphaelHelper = cks.raphaelHelper();

    var _drawFirstWallLengthText = function (textToDisplay) {
        var _topPath = _paper.top;
        var _firstDrawnPath = _isConnecting() ? _.last($(_paper.canvas).find("path"), 2)[0] : $(_paper.canvas).find("path:last")[0];
        _raphaelHelper.drawWallLengthText(_firstDrawnPath, textToDisplay, _paper);
        //bring the last path to front for undo
        _topPath.toFront();
    };

    var _insertWallLength = function () {
        $.colorbox({ inline: true, href: "#insertWallLengthModal" });
    };
    var _adjustEndPoint = function (x1, y1, x2, y2) {
        var _point = { "x": x2, "y": y2 };
        if (_snapToGrid === true) {
            if (Math.abs(x2 - x1) < 10) {
                _point.x = x1;
            }
            if (Math.abs(y2 - y1) < 10) {
                _point.y = y1;
            }
        }
        return _point;
    };
    var _adjustStartPoint = function (x1, y1) {
        var _point = { "x": x1, "y": y1 };
        var _allPoints = _.union(_.pluck(_walls(), "startPoint"), _.pluck(_walls(), "endPoint"));
        var _pointX = _.find(_allPoints, function (point) {
            return (Math.abs(x1 - point.x) < 10);
        });
        if (_pointX)
            _point.x = _pointX.x;
        var _pointY = _.find(_allPoints, function (point) {
            return (Math.abs(y1 - point.y) < 10);
        });
        if (_pointY)
            _point.y = _pointY.y;
        return _point;
    };
    var _findMatchedPoint = function (x1, y1) {
        var _allPoints = _.union(_.pluck(_walls(), "startPoint"), _.pluck(_walls(), "endPoint"));
        var _matchedPoint = _.find(_allPoints, function (point) {
            return (Math.abs(x1 - point.x) < 10) && (Math.abs(y1 - point.y) < 10);
        });
        return _matchedPoint;
    };
    var _fitToCanvas = function (width, height) {
        if (width > 700) {
            var _ratioW = 700 / width;
            width = 700;
            height = height * _ratioW;
        }
        if (height > 700) {
            var _ratioH = 700 / height;
            height = 700;
            width = width * _ratioH;
        }
        return { width: width, height: height };
    };
    var _firstClickSetup = function (x1, y1) {
        _startPoint = _adjustStartPoint(x1, y1);
        _raphaelHelper.drawCircle(_startPoint.x, _startPoint.y, 3, _paper);
        var _line = _raphaelHelper.drawLine(_startPoint.x, _startPoint.y, _startPoint.x, _startPoint.y, _paper, true, _isConnecting());
        if (_isFirstWall === true) {
            _popoverText("Click again to end tracing this wall");
        }
        $("#tracer").bind('mousemove', function (e) {
            var _x2 = e.offsetX;
            var _y2 = e.offsetY;
            _endPoint = _adjustEndPoint(_startPoint.x, _startPoint.y, _x2, _y2);
            _line.updateEnd(_endPoint.x, _endPoint.y);
            if (_onMouseMoveCallback)
                _onMouseMoveCallback(_startPoint, _endPoint, _isFirstWall);
        });
        if (_onMouseClickCallback)
            _onMouseClickCallback(_startPoint, _endPoint, _walls(), _isFirstWall, _isFirstClick);
        _isFirstClick = false;
    };

    var _drawWall = function (wall) {
        _raphaelHelper.drawCircle(wall.startPoint.x, wall.startPoint.y, 3, _paper);
        var _original = _isConnecting();
        if (wall.wallType == "Exterior") {
            _isConnecting(true);
        } else {
            _isConnecting(false);
        }
        _raphaelHelper.drawLine(wall.startPoint.x, wall.startPoint.y, wall.endPoint.x, wall.endPoint.y, _paper, false, _isConnecting());
        _raphaelHelper.drawCircle(wall.endPoint.x, wall.endPoint.y, 3, _paper);
        _isConnecting(_original);
    };

    var _onMouseClick = function (callback) {
        _onMouseClickCallback = callback;
    };
    var _onMouseMove = function (callback) {
        _onMouseMoveCallback = callback;
    };

    var _liveMouseMove = function (e) {
        if (!_popoverText()) {
            $("#canvasPopover").css("left", -1000);
        } else {
            $("#canvasPopover").css("top", e.pageY * 1 - 10 + "px").css("left", e.pageX * 1 + 20 + "px");
        }
    };
    var _liveMouseOut = function (e) {
        $("#canvasPopover").css("left", "-1000px");
    };
    var _liveClick = function (e) {
        if (_isConnecting() === undefined)
            return;
        if (_isFirstClick === true) {
            var _x = e.offsetX;
            var _y = e.offsetY;
            _firstClickSetup(_x, _y);
        } else {
            $("#tracer").unbind('mousemove');
            var _isMatchedPoint = !!_findMatchedPoint(_endPoint.x, _endPoint.y);
            _raphaelHelper.convertLastWallToSolidLine(_paper);
            if (_isFirstWall === true) {
                _insertWallLength();
                _isFirstWall = false;
                _popoverText("Click to start tracing the next wall");
            } else {
                _raphaelHelper.drawWallLengthText($(_paper.canvas).find("path:last")[0], _popoverText(), _paper);
            }
            _raphaelHelper.drawCircle(_endPoint.x, _endPoint.y, 3, _paper);
            _walls().push({ "startPoint": _startPoint, "endPoint": _endPoint, "wallType": _isConnecting() ? "Exterior" : "Internal" });
            if (_onMouseClickCallback)
                _onMouseClickCallback(_startPoint, _endPoint, _walls(), _isFirstWall, _isFirstClick);
            _isFirstClick = true;
            if (_isConnecting() === true) {
                if (_isMatchedPoint === false)
                    _liveClick(e);
                else {
                    _popoverText("Completed tracing walls");
                }
            }
        }
    };

    var _createCanvas = function () {
        if (_paper)
            return;
        _paper = new Raphael(document.getElementById('tracer'), 720, 720);
        $("#plan-step2").on("mousemove", "#tracer", _liveMouseMove);
        $("#plan-step2").on("mouseout", "#tracer", _liveMouseOut);
        $("#plan-step2").on("click", "#tracer", _liveClick);
        _paper.forEach(function (el) {
            _elements.push(el);
        });
        _isCanvasCreated(true);
    };

    var _loadUserBackground = function (url) {
        var _deferred = new $.Deferred();
        if (!_paper)
            _createCanvas();
        _paper.clear();
        var _imageUrl = url;
        var _planBackgroundImage = new Image();
        _planBackgroundImage.src = _imageUrl;
        _planBackgroundImage.onload = function () {
            var _fittedSize = _fitToCanvas(_planBackgroundImage.width, _planBackgroundImage.height);
            var _image = _paper.image(url, 10, 10, _fittedSize.width, _fittedSize.height);
            _deferred.resolve();
        };
        _isFirstWall = true;
        return _deferred.promise();
    };
    var _loadSampleBackground = function () {
        var _deferred = new $.Deferred();
        if (!_paper)
            _createCanvas();
        _paper.clear();
        var _imageUrl = "/Images/PlanBackground.png";
        var _planBackgroundImage = new Image();
        _planBackgroundImage.src = _imageUrl;
        _planBackgroundImage.onload = function () {
            var _fittedSize = _fitToCanvas(_planBackgroundImage.width, _planBackgroundImage.height);
            var _image = _paper.image("/Images/PlanBackground.png", 10, 10, _fittedSize.width, _fittedSize.height);
            _deferred.resolve();
        };
        _isFirstWall = true;
        return _deferred.promise();
    };
    var _loadBlankBackground = function () {
        var _deferred = new $.Deferred();
        if (!_paper)
            _createCanvas();
        setTimeout(function () {
            _raphaelHelper.drawGridLines(_paper);
            _paper.setFinish();
            _paper.renderfix();
            _deferred.resolve();
        }, 500);
        _isFirstWall = true;
        return _deferred.promise();
    };

    var _removeItems = function (selector) {
        var _indexToRemove = $(_paper.canvas).find(selector).index();
        var _itemsToRemove = _paper.canvas.children.length - _indexToRemove;
        for (var i = 0; i < _itemsToRemove; i++) {
            _paper.top.remove();
        }
    };
    var _undo = function () {
        if (_isConnecting() === true) {
            if (_isFirstClick === false) {
                if (_walls().length === 0) {
                    _removeItems('circle:first');
                    _popoverText("Click to start tracing walls");
                    _isFirstClick = true;
                } else {
                    _removeItems('path:nth-last-of-type(2)');
                }
            } else {
                _removeItems('path:last');
                _isFirstClick = false;
            }

            if (_walls().length > 0) {
                _walls().pop();
                _isFirstWall = _walls().length === 0 ? true : false;
            }
        } else {
            if (_isFirstClick === false) {
                _removeItems('circle:last');
            } else {
                _removeItems('circle:nth-last-of-type(2)');
            }
            _popoverText("Click to start tracing walls");
            if (_walls().length > 0) {
                _walls().pop();
                _isFirstWall = _walls().length === 0 ? true : false;
            }
            _isFirstClick = true;
        }
        if (_isFirstClick === false) {
            var _x = 0;
            var _y = 0;
            _paper.forEach(function (e) {
                if (e.type === "circle") {
                    _x = e.attrs.cx;
                    _y = e.attrs.cy;
                }
            });

            _firstClickSetup(_x, _y);
        }
        if (_onMouseClickCallback)
            _onMouseClickCallback(_startPoint, _endPoint, _walls(), _isFirstWall, _isFirstClick);
    };
    
    var _getPaper = function () {
        return _paper;
    };

    return {
        getPaper: _getPaper,
        createCanvas: _createCanvas,
        loadSampleBackground: _loadSampleBackground,
        loadBlankBackground: _loadBlankBackground,
        loadUserBackground: _loadUserBackground,
        popoverText: _popoverText,
        walls: _walls,
        onMouseClick: _onMouseClick,
        onMouseMove: _onMouseMove,
        isConnecting: _isConnecting,
        elements: _elements,
        undo: _undo,
        drawWall: _drawWall,
        isCanvasCreated: _isCanvasCreated,
        drawFirstWallLengthText: _drawFirstWallLengthText,
    };
};