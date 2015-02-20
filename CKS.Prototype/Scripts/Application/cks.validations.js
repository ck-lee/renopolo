var cks = cks || {};
cks.validations = {};

cks.validations.requiredField = function (input) {
    if (!input)
        return false;

    if (typeof (input.length) !== 'undefined' && input.length === 0)
        return false;

    if (typeof (input) === 'string' && $.trim(input).length === 0)
        return false;

    return true;
};

cks.validations.emailField = function (email) {
    var _regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return _regex.test(email);
};

cks.validations.numberOnly = function (value) {
    return !isNaN(value);
};

cks.validations.requiredFieldForMeasurement = function (unitsSystem, cm, ft, inch) {
    if (unitsSystem === "Imperial")
        return cks.validations.requiredField(ft) && cks.validations.requiredField(inch);
    else
        return cks.validations.requiredField(cm);
};

cks.validations.numberOnlyForMeasurement = function (unitsSystem, cm, ft, inch) {
    if (!cks.validations.requiredFieldForMeasurement(unitsSystem, cm, ft, inch)) {
        return true;
    }
    if (unitsSystem === "Imperial") {
        var _result = !isNaN(ft);
        _result = _result && !isNaN(inch);
        return _result;
    } else {
        return !isNaN(cm);
    }
};

cks.validations.typicalCeilingHeightImperial = function (unitsSystem, cm, ft, inch) {
    if (!cks.validations.requiredFieldForMeasurement(unitsSystem, cm, ft, inch)) {
        return true;
    }
    if (unitsSystem === "Imperial") {
        return (ft >= 3 && ft <= 20);
    }
    return true;
};

cks.validations.typicalCeilingHeightMetric = function (unitsSystem, cm, ft, inch) {
    if (!cks.validations.requiredFieldForMeasurement(unitsSystem, cm, ft, inch)) {
        return true;
    }
    if (unitsSystem !== "Imperial") {
        return (cm >= 90 && cm <= 600)
    }
    return true;
};

cks.validations.typicalFirstWallLengthImperial = function (unitsSystem, cm, ft, inch) {
    if (!cks.validations.requiredFieldForMeasurement(unitsSystem, cm, ft, inch)) {
        return true;
    }
    if (unitsSystem === "Imperial") {
        return (ft >= 0 && ft <= 300);
    }
    return true;
};

cks.validations.typicalFirstWallLengthMetric = function (unitsSystem, cm, ft, inch) {
    if (!cks.validations.requiredFieldForMeasurement(unitsSystem, cm, ft, inch)) {
        return true;
    }
    if (unitsSystem !== "Imperial") {
        return (cm >= 1 && cm <= 9000)
    }
    return true;
};

cks.validations.inchIsValid = function (unitsSystem, inch) {
    if (unitsSystem === "Imperial" && inch)
        return inch < 12;
    return true;
};

cks.validations.computedFromInput = function (unitsSystem, cm, ft, inch) {
    if (unitsSystem === "Imperial") {
        if (isNaN(ft) || isNaN(inch))
            return;
        return parseInt(ft) + parseInt(inch) / 12;
    }
    else {
        if (isNaN(cm))
            return;
        return cm;
    }
};

cks.validations.checkFieldsAreValid = function (observablesWithValidation) {
    var _allFieldsAreValid = true;
    $.each(observablesWithValidation(), function (index, observable) {
        observable.isTriggered(true);
    });
    $.each(observablesWithValidation(), function (index, observable) {
        if (observable.isValid() === false) {
            _allFieldsAreValid = false;
        }
    });
    if (_allFieldsAreValid === false) {
        if (cks.transitions.scrollToError) {
            cks.transitions.scrollToError();
        }
    }
    return _allFieldsAreValid;
};