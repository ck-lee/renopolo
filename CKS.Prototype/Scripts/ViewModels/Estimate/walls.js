var cks = cks || {};
cks.viewModels = cks.viewModels || {};
cks.viewModels.walls = function (planningVm, tracer) {
    var _observablesWithValidation = ko.observableArray();
    var _thickness = ko.observable();
    var _heightInput = ko.observable();
    _heightInput.cm = ko.observable();
    _heightInput.ft = ko.observable();
    _heightInput.in = ko.observable();

    var _sectionId = ko.observable();
    var _sectionCreatedDate = ko.observable();

    var _measurements = cks.measurements();
    
    var _height = ko.computed(function () {
        return cks.validations.computedFromInput(planningVm.unitsSystem(), _heightInput.cm(), _heightInput.ft(), _heightInput.in());
    });

    var _heightInCm = ko.computed(function () {
        return _measurements.calculateLengthInCmFromInputs(planningVm.unitsSystem(), _heightInput.cm(), _heightInput.ft(), _heightInput.in());
    });

    var _getMeasurementInDisplay = function (lengthInCm) {
        return planningVm.unitsSystem() === "Imperial" ? _measurements.getFtInDisplay(_measurements.convertCmToFt(lengthInCm)) : _measurements.getCmInDisplay(lengthInCm);
    };
    
    _height.extend({
        validations: {
            rules: [{ validationFunction: function () { return cks.validations.requiredFieldForMeasurement(planningVm.unitsSystem(), _heightInput.cm(), _heightInput.ft(), _heightInput.in()); }, errorMessage: "Please enter a height.", triggerOnly: true },
            { validationFunction: function () { return cks.validations.numberOnlyForMeasurement(planningVm.unitsSystem(), _heightInput.cm(), _heightInput.ft(), _heightInput.in()); }, errorMessage: "Please enter numbers only." },
            { validationFunction: function () { return cks.validations.typicalCeilingHeightImperial(planningVm.unitsSystem(), _heightInput.cm(), _heightInput.ft(), _heightInput.in()); }, errorMessage: "Please enter a typical ceiling height. 3ft - 20ft" },
            { validationFunction: function () { return cks.validations.typicalCeilingHeightMetric(planningVm.unitsSystem(), _heightInput.cm(), _heightInput.ft(), _heightInput.in()); }, errorMessage: "Please enter a typical ceiling height. 90cm - 600cm" },
            { validationFunction: function () { return cks.validations.inchIsValid(planningVm.unitsSystem(), _heightInput.in()); }, errorMessage: "Please enter less than 12 in the inch field" }],
            watch: _observablesWithValidation
        }
    });
    
    var _firstWallLengthInput = ko.observable();
    _firstWallLengthInput.cm = ko.observable();
    _firstWallLengthInput.ft = ko.observable();
    _firstWallLengthInput.in = ko.observable();
    var _pseudoFirstWallLength = ko.computed(function () {
        return cks.validations.computedFromInput(planningVm.unitsSystem(), _firstWallLengthInput.cm(), _firstWallLengthInput.ft(), _firstWallLengthInput.in());
    });

    var _firstWallLengthInCm = ko.computed(function () {
        return _measurements.calculateLengthInCmFromInputs(planningVm.unitsSystem(), _firstWallLengthInput.cm(), _firstWallLengthInput.ft(), _firstWallLengthInput.in());
    });
    
    _pseudoFirstWallLength.extend({
        validations: {
            rules: [{ validationFunction: function () { return cks.validations.requiredFieldForMeasurement(planningVm.unitsSystem(), _firstWallLengthInput.cm(), _firstWallLengthInput.ft(), _firstWallLengthInput.in()); }, errorMessage: "Please enter the actual length.", triggerOnly: true },
            { validationFunction: function () { return cks.validations.numberOnlyForMeasurement(planningVm.unitsSystem(), _firstWallLengthInput.cm(), _firstWallLengthInput.ft(), _firstWallLengthInput.in()); }, errorMessage: "Please enter numbers only." },
            { validationFunction: function () { return cks.validations.inchIsValid(planningVm.unitsSystem(), _firstWallLengthInput.in()); }, errorMessage: "Please enter less than 12 in the inch field" },
            { validationFunction: function () { return cks.validations.typicalFirstWallLengthImperial(planningVm.unitsSystem(), _firstWallLengthInput.cm(), _firstWallLengthInput.ft(), _firstWallLengthInput.in()); }, errorMessage: "Please enter a typical wall length. 0ft - 300ft" },
            { validationFunction: function () { return cks.validations.typicalFirstWallLengthMetric(planningVm.unitsSystem(), _firstWallLengthInput.cm(), _firstWallLengthInput.ft(), _firstWallLengthInput.in()); }, errorMessage: "Please enter a typical wall length. 1cm - 9000cm" }],
            watch: _observablesWithValidation
        }
    });
    
    var _checkNaN = function (number) {
        return isNaN(number) ? 0 : number;
    };
    

    var _doubleSurfaceArea = ko.observable(true);

    var _doubleSurfaceAreaNoClicked = function () {
        _doubleSurfaceArea(false);
    };
    
    var _doubleSurfaceAreaYesClicked = function () {
        _doubleSurfaceArea(true);
    };

    var _internalAdjustments = ko.observableArray([]);

    var _internalAdjustmentsSqM = ko.computed(function () {
        var _total = 0;
        _.each(_internalAdjustments(), function (adjustment) {
            _total = _total + _measurements.tryParseFloat(adjustment.totalSizeInSqM());
        });
        return _total;
    });

    var _prefixSign = function (number) {
        if (number > 0)
            return "-";
        else if (number < 0)
            return "+";
        return "";
    };
    
    var _internalAdjustmentsDisplay = ko.computed(function () {
        var _display = _measurements.getAreaInDisplay(_checkNaN(_measurements.convertSqMToSqCm(_internalAdjustmentsSqM())), planningVm.unitsSystem());
        return _prefixSign(_internalAdjustmentsSqM()) + _display;
    });

    var _firstWallLengthModalCloseClicked = function () {
        _pseudoFirstWallLength.isTriggered(true);
        if (_pseudoFirstWallLength.isValid() === false) {
            return;
        }
        var _textToDisplay = _getMeasurementInDisplay(_firstWallLengthInCm());
        tracer.drawFirstWallLengthText(_textToDisplay);
        $.colorbox.close();
    };
    
    var _exteriorAdjustmentsSelection = ko.observableArray(
        [
            { value: "Windows", text: "Windows" },
            { value: "Doors", text: "Doors" },
            { value: "BalconyDoors", text: "Balcony Doors" },
            { value: "Others", text: "Others" }
        ]
    );
    
    var _internalAdjustmentsSelection = ko.observableArray(
        [
            { value: "Doors", text: "Doors" },
            { value: "WardrobeDoors", text: "Wardrobe Doors" },
            { value: "AttachedCabinets", text: "Attached Cabinets" },
            { value: "Others", text: "Others" }
        ]
    );
    
    var _exteriorAdjustments = ko.observableArray([]);
    
    var _exteriorAdjustmentsSqM = ko.computed(function () {
        var _total = 0;
        _.each(_exteriorAdjustments(), function (adjustment) {
            _total = _total + _measurements.tryParseFloat(adjustment.totalSizeInSqM());
        });
        return _total;
    });

    var _populateAdjustmentProperties = function (selectedType, count, sizeSqM, sizeSqFt, totalSizeSqM, totalSizeSqFt, adjustments) {
        var _adjustment = new cks.viewModels.adjustment(planningVm, _exteriorAdjustmentsSelection, _internalAdjustmentsSelection);
        _adjustment.setProperties(selectedType, count, sizeSqM, sizeSqFt, totalSizeSqM, totalSizeSqFt);
        adjustments.push(_adjustment);
    };
    
    var _exteriorAdjustmentsDisplay = ko.computed(function () {
        var _display = _measurements.getAreaInDisplay(_checkNaN(_measurements.convertSqMToSqCm(_exteriorAdjustmentsSqM())), planningVm.unitsSystem());
        return _prefixSign(_exteriorAdjustmentsSqM()) + _display;
    });

    var _populateTypicalAdjustmentProperties = function () {
        //TODO: add in condition to check for walls.length
        //TODO: adjust acc
        if (_internalAdjustments().length === 0) {
            _populateAdjustmentProperties("Doors", 6, 1.65, 17.78, 9.90, 106.68, _internalAdjustments);
            _populateAdjustmentProperties("WaldrobeDoors", 3, 1.65, 17.78, 4.95, 53.34, _internalAdjustments);
        }
        if (_exteriorAdjustments().length === 0) {
            _populateAdjustmentProperties("Windows", 24, 0.80, 8.6, 19.20, 206.4, _exteriorAdjustments);
            _populateAdjustmentProperties("Doors", 2, 1.65, 17.78, 3.30, 35.56, _exteriorAdjustments);
            _populateAdjustmentProperties("BalconyDoors", 3, 1.65, 17.78, 4.95, 53.34, _exteriorAdjustments);
        }
    };

    var _addInternalAdjusmentClicked = function () {
        var _adjustment = new cks.viewModels.adjustment(planningVm, _exteriorAdjustmentsSelection, _internalAdjustmentsSelection, true);
        _internalAdjustments.push(_adjustment);
    };
    
    var _removeInternalAdjustmentClicked = function (adjustment) {
        _internalAdjustments.remove(adjustment);
    };
    
    var _addExteriorAdjusmentClicked = function () {
        var _adjustment = new cks.viewModels.adjustment(planningVm, _exteriorAdjustmentsSelection, _internalAdjustmentsSelection, true);
        _exteriorAdjustments.push(_adjustment);
    };

    var _removeExteriorAdjustmentClicked = function (adjustment) {
        _exteriorAdjustments.remove(adjustment);
    };

    return {
        thickness: _thickness,
        height: _height,
        heightInput: _heightInput,
        heightInCm: _heightInCm,
        observablesWithValidation: _observablesWithValidation,
        sectionId: _sectionId,
        getMeasurementInDisplay: _getMeasurementInDisplay,
        sectionCreatedDate: _sectionCreatedDate,
        pseudoFirstWallLength: _pseudoFirstWallLength,
        firstWallLengthInput: _firstWallLengthInput,
        firstWallLengthInCm: _firstWallLengthInCm,
        exteriorAdjustmentsSqM: _exteriorAdjustmentsSqM,
        exteriorAdjustmentsDisplay: _exteriorAdjustmentsDisplay,
        doubleSurfaceAreaNoClicked: _doubleSurfaceAreaNoClicked,
        doubleSurfaceAreaYesClicked: _doubleSurfaceAreaYesClicked,
        doubleSurfaceArea: _doubleSurfaceArea,
        internalAdjustmentsSqM: _internalAdjustmentsSqM,
        internalAdjustmentsDisplay: _internalAdjustmentsDisplay,
        firstWallLengthModalCloseClicked: _firstWallLengthModalCloseClicked,
        exteriorAdjustments: _exteriorAdjustments,
        exteriorAdjustmentsSelection: _exteriorAdjustmentsSelection,
        populateAdjustmentProperties: _populateAdjustmentProperties,
        populateTypicalAdjustmentProperties: _populateTypicalAdjustmentProperties,
        internalAdjustmentsSelection: _internalAdjustmentsSelection,
        internalAdjustments: _internalAdjustments,
        addInternalAdjusmentClicked: _addInternalAdjusmentClicked,
        addExteriorAdjusmentClicked: _addExteriorAdjusmentClicked,
        removeInternalAdjustmentClicked: _removeInternalAdjustmentClicked,
        removeExteriorAdjustmentClicked: _removeExteriorAdjustmentClicked,
        
    };
}