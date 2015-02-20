var cks = cks || {};
cks.raphaelHelper = function () {
    var _drawCircle = function (startX, startY, size, paper) {
        var _circle = paper.circle(startX, startY, size);
        _circle.attr("stroke-width", "5");
        _circle.attr("stroke", "#333333");
        _circle.toFront();
    };
    var _drawLine = function (startX, startY, endX, endY, paper, dotted, isConnecting) {
        var _start = {
            x: startX,
            y: startY
        };
        var _end = {
            x: endX,
            y: endY
        };
        var _getPath = function () {
            return "M" + _start.x + " " + _start.y + " L" + _end.x + " " + _end.y;
        };
        var _redraw = function () {
            _node.attr("path", _getPath());
        };

        var _node = paper.path(_getPath());
        _node.attr("stroke-width", "5");
        if (dotted === true) {
            _node.attr({ "stroke-dasharray": "." });
        } else {
            _node.attr({ "stroke-dasharray": "" });
        }
        if (isConnecting === true)
            _node.attr("stroke", "#d84a38");
        else
            _node.attr("stroke", "#35aa47");

        return {
            updateStart: function(x, y) {
                _start.x = x;
                _start.y = y;
                _redraw();
                return this;
            },
            updateEnd: function(x, y) {
                _end.x = x;
                _end.y = y;
                _redraw();
                return this;
            },
            path: _node
        };
    };
    var _convertLastWallToSolidLine = function (paper) {
        $(paper.canvas).find("path:last").attr({ "stroke-dasharray": "" });
    };
    var _drawWallLengthText = function (pathElement, textToDisplay, paper) {
        var _pathBBox = pathElement.getBBox();
        var _textattr = { 'font-size': 14, fill: "#333333", stroke: 'none', 'font-family': 'Arial,Helvetica,sans-serif', 'font-weight': 400 };
        var _x = Math.floor(_pathBBox.x + _pathBBox.width / 2.0);
        var _y = Math.floor(_pathBBox.y + _pathBBox.height / 2.0);
        var _text = paper.text(_x, _y, textToDisplay).attr(_textattr);
        var _textBBox = _text.getBBox();
        paper.rect(_textBBox.x, _textBBox.y, _textBBox.width, _textBBox.height).attr('fill', '#ff7518');
        _text.toFront();
        //work around to avoid text to have cursor showing
        paper.rect(_textBBox.x, _textBBox.y, _textBBox.width, _textBBox.height).attr({ fill: "#ffffff", opacity: 0 });
    };
    var _drawGridLines = function (paper) {

        paper.clear();
        paper.setStart();

        paper.path("M 0 100 L 700 100").attr("stroke", "#4d90fe");
        paper.text(710, 100, "100").attr("font-familystring", "Nimbus Sans L,sans-serif").attr("font-size", 10).attr("stroke", "#333333");
        paper.path("M 0 200 L 700 200").attr("stroke", "#4d90fe");
        paper.text(710, 200, "200").attr("font-familystring", "Nimbus Sans L,sans-serif").attr("font-size", 10).attr("stroke", "#333333");
        paper.path("M 0 300 L 700 300").attr("stroke", "#4d90fe");
        paper.text(710, 300, "300").attr("font-familystring", "Nimbus Sans L,sans-serif").attr("font-size", 10).attr("stroke", "#333333");
        paper.path("M 0 400 L 700 400").attr("stroke", "#4d90fe");
        paper.text(710, 400, "400").attr("font-familystring", "Nimbus Sans L,sans-serif").attr("font-size", 10).attr("stroke", "#333333");
        paper.path("M 0 500 L 700 500").attr("stroke", "#4d90fe");
        paper.text(710, 500, "500").attr("font-familystring", "Nimbus Sans L,sans-serif").attr("font-size", 10).attr("stroke", "#333333");
        paper.path("M 0 600 L 700 600").attr("stroke", "#4d90fe");
        paper.text(710, 600, "600").attr("font-familystring", "Nimbus Sans L,sans-serif").attr("font-size", 10).attr("stroke", "#333333");
        paper.path("M 0 700 L 700 700").attr("stroke", "#4d90fe");
        paper.text(710, 700, "700").attr("font-familystring", "Nimbus Sans L,sans-serif").attr("font-size", 10).attr("stroke", "#333333");

        paper.path("M 100 0 L 100 700").attr("stroke", "#4d90fe");
        paper.text(100, 705, "100").attr("font-familystring", "Nimbus Sans L,sans-serif").attr("font-size", 10).attr("stroke", "#333333");
        paper.path("M 200 0 L 200 700").attr("stroke", "#4d90fe");
        paper.text(200, 705, "200").attr("font-familystring", "Nimbus Sans L,sans-serif").attr("font-size", 10).attr("stroke", "#333333");
        paper.path("M 300 0 L 300 700").attr("stroke", "#4d90fe");
        paper.text(300, 705, "300").attr("font-familystring", "Nimbus Sans L,sans-serif").attr("font-size", 10).attr("stroke", "#333333");
        paper.path("M 400 0 L 400 700").attr("stroke", "#4d90fe");
        paper.text(400, 705, "400").attr("font-familystring", "Nimbus Sans L,sans-serif").attr("font-size", 10).attr("stroke", "#333333");
        paper.path("M 500 0 L 500 700").attr("stroke", "#4d90fe");
        paper.text(500, 705, "500").attr("font-familystring", "Nimbus Sans L,sans-serif").attr("font-size", 10).attr("stroke", "#333333");
        paper.path("M 600 0 L 600 700").attr("stroke", "#4d90fe");
        paper.text(600, 705, "600").attr("font-familystring", "Nimbus Sans L,sans-serif").attr("font-size", 10).attr("stroke", "#333333");
        paper.path("M 700 0 L 700 700").attr("stroke", "#4d90fe");
        paper.text(700, 705, "700").attr("font-familystring", "Nimbus Sans L,sans-serif").attr("font-size", 10).attr("stroke", "#333333");

        paper.path("M 0 50 L 700 50").attr("stroke", "#FFFF00");
        paper.path("M 0 150 L 700 150").attr("stroke", "#FFFF00");
        paper.path("M 0 250 L 700 250").attr("stroke", "#FFFF00");
        paper.path("M 0 350 L 700 350").attr("stroke", "#FFFF00");
        paper.path("M 0 450 L 700 450").attr("stroke", "#FFFF00");
        paper.path("M 0 550 L 700 550").attr("stroke", "#FFFF00");
        paper.path("M 0 650 L 700 650").attr("stroke", "#FFFF00");
        paper.path("M 50 0 L 50 700").attr("stroke", "#FFFF00");
        paper.path("M 150 0 L 150 700").attr("stroke", "#FFFF00");
        paper.path("M 250 0 L 250 700").attr("stroke", "#FFFF00");
        paper.path("M 350 0 L 350 700").attr("stroke", "#FFFF00");
        paper.path("M 450 0 L 450 700").attr("stroke", "#FFFF00");
        paper.path("M 550 0 L 550 700").attr("stroke", "#FFFF00");
        paper.path("M 650 0 L 650 700").attr("stroke", "#FFFF00");
    };
    var _drawGlow = function(path, startPointX, startPointY, endPointX, endPointY, isConnecting, rightSideUp) {
        path.clone().scale(0.95).hide();
            var _shadowExterior = path.clone().scale(1.0).hide();
            var _shadowInterior = path.clone().scale(0.9).hide();
            var _offsetx = 0;
            var _offsety = 0;
            if (endPointX - startPointX > 10) {
                _offsety = -7;
            } else if (endPointX - startPointX < -10) {
                _offsety = 7;
            }
            if (endPointY - startPointY > 10) {
                _offsetx = 7;
            } else if (endPointY - startPointY < -10) {
                _offsetx = -7;
            }
            if (isConnecting) {
                if (rightSideUp) {
                    _shadowExterior.glow({ width: 7, color: '#d84a38', opacity: '2', offsetx: _offsetx, offsety: _offsety }).toBack();
                    _shadowInterior.glow({ width: 7, color: '#852b99', opacity: '2', offsetx: -_offsetx, offsety: -_offsety }).toBack();
                } else {
                    _shadowExterior.glow({ width: 7, color: '#d84a38', opacity: '2', offsetx: -_offsetx, offsety: -_offsety }).toBack();
                    _shadowInterior.glow({ width: 7, color: '#852b99', opacity: '2', offsetx: _offsetx, offsety: _offsety }).toBack();

                }
                path.attr({ stroke: "#d84a38", "stroke-width": 2 });
            } else {
                _shadowInterior.glow({ width: 7, color: '#852b99', opacity: '1.5', offsetx: _offsetx, offsety: _offsety }).toBack();
                _shadowInterior.glow({ width: 7, color: '#852b99', opacity: '1.5', offsetx: -_offsetx, offsety: -_offsety }).toBack();
                path.attr({ stroke: "#35aa47", "stroke-width": 2 });
            }
    };
    return {
        drawLine: _drawLine,
        drawCircle: _drawCircle,
        convertLastWallToSolidLine: _convertLastWallToSolidLine,
        drawWallLengthText: _drawWallLengthText,
        drawGridLines: _drawGridLines,
        drawGlow: _drawGlow
    };
};