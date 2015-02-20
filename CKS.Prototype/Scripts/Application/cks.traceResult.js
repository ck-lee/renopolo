var cks = cks || {};
cks.traceResult = function () {
    var _paper;
    var _isCanvasCreated = ko.observable(false);
    var _isConnecting = ko.observable();
    var _raphaelHelper = cks.raphaelHelper();
    var _createCanvas = function () {
        if (_paper)
            return;
        _paper = new Raphael(document.getElementById('traceResult'), 720, 720);
        _paper.clear();
        _isCanvasCreated(true);
    };
    var _drawWall = function (wall, rightSightUp) {
        _raphaelHelper.drawCircle(wall.points.startPoint.x, wall.points.startPoint.y, 3, _paper);
        var _original = _isConnecting();
        if (wall.wallType == "Exterior") {
            _isConnecting(true);
        } else {
            _isConnecting(false);
        }
        var _line = _raphaelHelper.drawLine(wall.points.startPoint.x, wall.points.startPoint.y, wall.points.endPoint.x, wall.points.endPoint.y, _paper, false, _isConnecting());
        setTimeout(function() {
            _raphaelHelper.drawGlow(_line.path, wall.points.startPoint.x, wall.points.startPoint.y, wall.points.endPoint.x, wall.points.endPoint.y, wall.wallType === "Exterior", rightSightUp);
            _raphaelHelper.drawWallLengthText(_line.path, wall.area.display, _paper);
        }, 500);
        _raphaelHelper.drawCircle(wall.points.endPoint.x, wall.points.endPoint.y, 3, _paper);
        _isConnecting(_original);
    };
    var _clearCanvas = function() {
        _paper.clear();
    };
    return {        
        createCanvas: _createCanvas,
        drawWall: _drawWall,
        clearCanvas: _clearCanvas
    };

}