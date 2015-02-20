var cks = cks || {};
cks.measurements = function() {
    var _isPositiveNumber = function(value) {
        return !isNaN(value) && value >= 0 ? true : false;
    };
    var _isAllPositiveNumber = function (value1, value2, value3, value4) {
        return _isPositiveNumber(value1) && _isPositiveNumber(value2) && _isPositiveNumber(value3) && _isPositiveNumber(value4) ? true : false;
    };
    var _getFtInDisplay = function (ftDecimal) {
        if (isNaN(ftDecimal) || ftDecimal <=0 ) {
            return undefined;
        }
        var _ftAndIn = _getFtAndInFromFtDecimal(ftDecimal);
        return _ftAndIn.ft + "' " + _ftAndIn.in + "\"";
    };
    var _getFtAndInFromFtDecimal = function (ftDecimal) {
        if (isNaN(ftDecimal) || ftDecimal <= 0) {
            return undefined;
        }
        return {
            "ft": Math.floor(ftDecimal),
            "in": Math.round((ftDecimal % 1) * 12)
        };
    };
    var _getFtAndInFromCm = function (cm) {
        if (isNaN(cm) || cm <= 0) {
            return undefined;
        }
        var _ftDecimal = _convertCmToFt(cm);
        return _getFtAndInFromFtDecimal(_ftDecimal);
    };
    var _getCmInDisplay = function (cm) {
        if (isNaN(cm) || cm < 0) {
            return undefined;
        }
        return Math.round(cm).toString() + " cm";
    };
    var _getAreaFtInDisplay = function (ftDecimal) {
        if (isNaN(ftDecimal) || ftDecimal < 0) {
            return undefined;
        }
        return Math.round(ftDecimal).toString() + " sq ft";
    };
    var _getAreaCmInDisplay = function (cm) {
        if (isNaN(cm) || cm <= 0) {
            return undefined;
        }
        return (cm / 10000).toFixed(2).toString() + " m²";
    };
    
    var _getAreaMInDisplay = function (m) {
        if (isNaN(m) || m <= 0) {
            return undefined;
        }
        return (m).toString() + " m²";
    };

    var _calculateDistance = function (x1, y1, x2, y2) {
        if (!_isAllPositiveNumber(x1, y1, x2, y2))
            return undefined;
        return Math.round(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
    };
    var _calculateActualLengthRatio = function(length, x1, y1, x2, y2) {
        if (!_isAllPositiveNumber(x1, y1, x2, y2) || !_isPositiveNumber(length))
            return undefined;
        return length / _calculateDistance(x1, y1, x2, y2);
    };
    
    var _calculateArea = function (length, height) {
        return length * height;
    };
    
    var _calculateLengthInCmFromInputs = function (unitsSystem, cm, ft, inch) {
        if (unitsSystem === "Imperial") {
            if (isNaN(ft) || isNaN(inch))
                return;
            return _convertFtToCm((parseInt(ft) + parseInt(inch) / 12));
        }
        else {
            if (isNaN(cm))
                return;
            return cm;
        }
    };
    
    var _calculateAreaInSqMFromInputs = function (unitsSystem, sqM, sqFt) {
        if (unitsSystem === "Imperial") {
            if (isNaN(sqFt))
                return;
            return _convertSqFtToSqM(sqFt);
        }
        else {
            if (isNaN(sqM))
                return;
            return _tryParseFloat(sqM);
        }
    };


    var _convertCmToFt = function(cm) {
        return cm * 0.0328084;
    };
    var _convertFtToCm = function (ft) {
        return ft * 30.48;
    };
    var _convertSqCmToSqFt = function (sqCm) {
        return sqCm * 0.00107639104;
    };
    var _convertSqCmToSqM = function (sqCm) {
        return sqCm * 0.0001;
    };
    var _convertSqMToSqCm = function (sqM) {
        return sqM * 10000;
    };
    var _convertSqFtToSqM = function (sqFt) {
        return sqFt * 0.092903;
    };

    var _convertSqMToSqFt = function (sqM) {
        return sqM * 10.7639;
    };

    var _getMeasurementInDisplay = function (lengthInCm, unitsSystem) {
        return unitsSystem === "Imperial" ? _getFtInDisplay(_convertCmToFt(lengthInCm)) : _getCmInDisplay(lengthInCm);
    };

    var _getAreaInDisplay = function (area, unitsSystem, isSqM) {
        if (isSqM === true)
            return unitsSystem === "Imperial" ? _getAreaFtInDisplay(_convertSqMToSqFt(area)) : _getAreaMInDisplay(area);
        return unitsSystem === "Imperial" ? _getAreaFtInDisplay(_convertSqCmToSqFt(area)) : _getAreaCmInDisplay(area);
    };

    var _tryToFixed2Decimal = function (number) {
        try {
            if (!isNaN(number)) {
                return parseFloat(number).toFixed(2);
            }
            return number.toFixed(2);
        } catch (_error) {
            return;
        }
    };

    var _isNumber = function (number) {
        if (typeof(number) === "string")
            return false;
        return !isNaN(number - 0) && number !== null && number !== "" && number !== false;
    };
    
    var _tryParseFloat = function (number) {
        try {
            if (_isNumber(number)=== true) {
                return number;
            }
            var _result = +(number.replace(/,/, '.'));
            return isNaN(_result) ? undefined : _result;
        } catch (_error) {
            return;
        }
    };
    var _numberToString = function (number) {
        if (_isNumber(number) === false) {
            return "";
        } else {
            return number.toString();
        }
    };
    var _populateInputFromCm = function (input, unitsSystem, cm) {
        if (unitsSystem === "Imperial") {
            var _heightFtAndIn = _getFtAndInFromCm(cm);
            input.ft(_numberToString(_heightFtAndIn.ft));
            input.in(_numberToString(_heightFtAndIn.in));
        } else {
            input.cm(_numberToString(cm));
        }
    };
    var _populateInputFromSqM = function (input, unitsSystem, sqM) {
        if (unitsSystem === "Imperial") {
            var _areaInSqFt = _round(_convertSqMToSqFt(sqM),1);
            input.sqFt(_numberToString(_areaInSqFt));
        } else {
            input.sqM(_numberToString(sqM));
        }
    };
    var _round = function (number, decimal) {
        return Math.round(number * decimal) / decimal;
    };
    return {
        getFtInDisplay: _getFtInDisplay,
        getCmInDisplay: _getCmInDisplay,
        getAreaFtInDisplay: _getAreaFtInDisplay,
        getAreaCmInDisplay: _getAreaCmInDisplay,
        getFtAndInFromFtDecimal: _getFtAndInFromFtDecimal,
        getFtAndInFromCm: _getFtAndInFromCm,
        calculateDistance: _calculateDistance,
        calculateActualLengthRatio: _calculateActualLengthRatio,
        calculateArea: _calculateArea,
        calculateLengthInCmFromInputs: _calculateLengthInCmFromInputs,
        calculateAreaInSqMFromInputs: _calculateAreaInSqMFromInputs,
        convertCmToFt: _convertCmToFt,
        convertFtToCm: _convertFtToCm,
        convertSqCmToSqFt: _convertSqCmToSqFt,
        convertSqCmToSqM: _convertSqCmToSqM,
        convertSqMToSqCm: _convertSqMToSqCm,
        convertSqFtToSqM: _convertSqFtToSqM,
        convertSqMToSqFt: _convertSqMToSqFt,
        getAreaInDisplay: _getAreaInDisplay,
        getMeasurementInDisplay: _getMeasurementInDisplay,
        tryToFixed2Decimal: _tryToFixed2Decimal,
        tryParseFloat: _tryParseFloat,
        populateInputFromCm: _populateInputFromCm,
        populateInputFromSqM: _populateInputFromSqM,
        round: _round
        
    };
};