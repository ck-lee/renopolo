module("cks.viewModels.walls");
test("height", 7, function() {
    var _app = cks.helpers.mockApplication();
    _app.planningVm.unitsSystem("Metric");
    _app.wallsVm.heightInput.cm("");
    equals(_app.wallsVm.height.isValid(), true, "Validates correctly");
    _app.wallsVm.height.isTriggered(true);
    equals(_app.wallsVm.height.isValid(), false, "Validates correctly");
    _app.wallsVm.heightInput.cm(123);
    equals(_app.wallsVm.height.isValid(), true, "Validates correctly");
    _app.planningVm.unitsSystem("Imperial");
    equals(_app.wallsVm.height.isValid(), true, "Validates correctly");
    _app.wallsVm.height.isTriggered(true);
    equals(_app.wallsVm.height.isValid(), false, "Validates correctly");
    _app.wallsVm.heightInput.ft(123);
    _app.wallsVm.heightInput.in(123);
    equals(_app.wallsVm.height.isValid(), false, "Validates correctly");
    _app.wallsVm.heightInput.in(11);
    equals(_app.wallsVm.height.isValid(), true, "Validates correctly");
});

test("pseudoFirstWallLength", 8, function () {
    var _app = cks.helpers.mockApplication();
    _app.planningVm.unitsSystem("Metric");
    _app.wallsVm.firstWallLengthInput.cm("");
    equals(_app.wallsVm.pseudoFirstWallLength.isValid(), true, "Validates correctly");
    _app.wallsVm.pseudoFirstWallLength.isTriggered(true);
    equals(_app.wallsVm.pseudoFirstWallLength.isValid(), false, "Validates correctly");
    _app.wallsVm.firstWallLengthInput.cm(123);
    equals(_app.wallsVm.pseudoFirstWallLength(), 123, "Computed correctly");
    equals(_app.wallsVm.pseudoFirstWallLength.isValid(), true, "Validates correctly");
    _app.planningVm.unitsSystem("Imperial");
    equals(_app.wallsVm.pseudoFirstWallLength.isValid(), true, "Validates correctly");
    _app.wallsVm.pseudoFirstWallLength.isTriggered(true);
    equals(_app.wallsVm.pseudoFirstWallLength.isValid(), false, "Validates correctly");
    _app.wallsVm.firstWallLengthInput.ft(123);
    _app.wallsVm.firstWallLengthInput.in(123);
    equals(_app.wallsVm.pseudoFirstWallLength.isValid(), false, "Validates correctly");
    _app.wallsVm.firstWallLengthInput.in(11);
    equals(_app.wallsVm.pseudoFirstWallLength.isValid(), true, "Validates correctly");
});

test("various Display Functions", 6, function () {
    var _app = cks.helpers.mockApplication();
    _app.planningVm.unitsSystem("Metric");
    _app.wallsVm.populateAdjustmentProperties("Doors", 6, 1.65, 17.78, 9.90, 106.68, _app.wallsVm.exteriorAdjustments);
    _app.wallsVm.populateAdjustmentProperties("Doors", 6, 1.65, 17.78, 9.90, 106.68, _app.wallsVm.internalAdjustments);
    equals(_app.wallsVm.getMeasurementInDisplay(123), "123 cm", "Computed correctly");
    equals(_app.wallsVm.exteriorAdjustmentsDisplay(), "-9.90 m²", "Computed correctly");
    equals(_app.wallsVm.internalAdjustmentsDisplay(), "-9.90 m²", "Computed correctly");

    _app.planningVm.unitsSystem("Imperial");
    _app.wallsVm.firstWallLengthInput.ft(123);
    _app.wallsVm.firstWallLengthInput.in(11);
    equals(_app.wallsVm.getMeasurementInDisplay(123), "4' 0\"", "Computed correctly");
    equals(_app.wallsVm.exteriorAdjustmentsDisplay(), "-107 sq ft", "Computed correctly");
    equals(_app.wallsVm.internalAdjustmentsDisplay(), "-107 sq ft", "Computed correctly");
});

test("exteriorAdjustmentsSqM", 1, function () {
    var _app = cks.helpers.mockApplication();
    _app.planningVm.unitsSystem("Metric");
    _app.wallsVm.populateAdjustmentProperties("Doors", 6, 1.65, 17.78, 9.90, 106.68, _app.wallsVm.exteriorAdjustments);
    _app.wallsVm.populateAdjustmentProperties("Windows", 24, 0.80, 8.6, 19.20, 206.4, _app.wallsVm.exteriorAdjustments);
    equals(_app.wallsVm.exteriorAdjustmentsSqM(), 29.10, "Computed correctly");
});
test("internalAdjustmentsSqM", 1, function () {
    var _app = cks.helpers.mockApplication();
    _app.planningVm.unitsSystem("Metric");
    _app.wallsVm.populateAdjustmentProperties("Doors", 6, 1.65, 17.78, 9.90, 106.68, _app.wallsVm.internalAdjustments);
    _app.wallsVm.populateAdjustmentProperties("Windows", 24, 0.80, 8.6, 19.20, 206.4, _app.wallsVm.internalAdjustments);
    equals(_app.wallsVm.internalAdjustmentsSqM(), 29.10, "Computed correctly");
});

test("populateAdjustmentProperties", 2, function () {
    var _app = cks.helpers.mockApplication();
    _app.planningVm.unitsSystem("Metric");
    _app.wallsVm.heightInput.cm(300);
    _app.wallsVm.firstWallLengthInput.cm(1000);
    _app.traceEstimateVm.walls([{
        "startPoint": { "x": 152, "y": 137 },
        "endPoint": { "x": 528, "y": 137 },
        "wallType": "Exterior"
    }, {
        "startPoint": { "x": 528, "y": 137 },
        "endPoint": { "x": 528, "y": 465 },
        "wallType": "Exterior"
    }, {
        "startPoint": { "x": 528, "y": 465 },
        "endPoint": { "x": 143, "y": 465 },
        "wallType": "Exterior"
    }, {
        "startPoint": { "x": 152, "y": 465 },
        "endPoint": { "x": 152, "y": 138 },
        "wallType": "Exterior"
    }, {
        "startPoint": { "x": 152, "y": 325 },
        "endPoint": { "x": 527, "y": 325 },
        "wallType": "Internal"
    }, {
        "startPoint": { "x": 340, "y": 137 },
        "endPoint": { "x": 340, "y": 464 },
        "wallType": "Internal"
    }]);
    _app.wallsVm.populateTypicalAdjustmentProperties();
    equals(_app.wallsVm.internalAdjustmentsSqM(), 14.850000000000001, "Computed correctly");
    equals(_app.wallsVm.exteriorAdjustmentsSqM(), 27.45, "Computed correctly");
});