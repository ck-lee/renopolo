var cks = cks || {};
cks.tracer= function() {
    var _pjs;
    var _updatePointsCallback;
    var _calculateDistanceCallback;
    var _setJavaScript = function() {
        _pjs = Processing.getInstanceById("tracer");
        _pjs.setJavaScript(this);
    };
    var _points = [];
    var _getPoints = function() {
        var _pointsArray = _pjs.getPoints().toArray();
        var _result = _.map(_pointsArray, function(point) {
            return { "x": point.x, "y": point.y };
        });
        return _result;
    };
    var _updatePoints = function() {
        _points = _getPoints();
        _updatePointsCallback();
    };
    var _insertWallLength = function() {
        $('#insertWallLengthModal').modal('show');
    };
    var _onUpdatePoints = function(callback) {
        _updatePointsCallback = callback;
    };

    var _setBackgroundWithPlan = function(isWithPlan) {
        if (!_pjs)
            _setJavaScript();
        _pjs.setBackgroundWithPlan(isWithPlan);
        setTimeout(function () {
            _pjs.redrawCanvas();
        }, 100);
    };

    var _redrawCanvas = function() {
        _pjs.redrawCanvas();
    };

    var _onCalculateDistance = function(callback) {
        _calculateDistanceCallback = callback;
    };

    var _calculateDistance = function (x1, y1, x2, y2) {
        return _calculateDistanceCallback(x1,y1,x2,y2);
    };
    return {
        getPoints: _getPoints,
        updatePoints: _updatePoints,
        points: _points,
        onUpdatePoints: _onUpdatePoints,
        onCalculateDistance: _onCalculateDistance,
        insertWallLength: _insertWallLength,
        calculateDistance: _calculateDistance,
        setJavaScript: _setJavaScript,
        setBackgroundWithPlan: _setBackgroundWithPlan,
        redrawCanvas: _redrawCanvas
    };
};