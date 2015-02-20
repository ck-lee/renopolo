module("cks.viewModels.adjustment");

test("various computed functions", 8, function () {
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
    _app.wallsVm.internalAdjustments()[0].sizeInput.sqM(1);
    equals(_app.wallsVm.internalAdjustments()[0].totalSizeInput.sqM(), "6.00", "Computed correctly");
    equals(_app.wallsVm.internalAdjustments()[0].sizeInSqM(), 1, "Computed correctly");
    equals(_app.wallsVm.internalAdjustments()[0].totalSizeInSqM(), 6, "Computed correctly");
    _app.planningVm.unitsSystem("Imperial");
    _app.wallsVm.internalAdjustments()[0].sizeInput.sqFt(1);
    equals(_app.wallsVm.internalAdjustments()[0].sizeInSqM(), 0.092903, "Computed correctly");
    equals(_app.wallsVm.internalAdjustments()[0].totalSizeInSqM(), 0.557418, "Computed correctly");
    equals(_app.wallsVm.internalAdjustments()[0].totalSizeInput.sqFt(), "6.00", "Computed correctly");
    _app.wallsVm.internalAdjustments()[0].count(3);
    equals(_app.wallsVm.internalAdjustments()[0].totalSizeInput.sqM(), "3.00", "Computed correctly");
    equals(_app.wallsVm.internalAdjustments()[0].totalSizeInput.sqFt(), "3.00", "Computed correctly");
    
});

test("totalIsCalculated", 4, function () {
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
    _app.wallsVm.internalAdjustments()[0].sizeInput.sqM(1);
    equals(_app.wallsVm.internalAdjustments()[0].totalIsCalculated(), true, "Computed correctly");
    _app.wallsVm.internalAdjustments()[0].totalSizeInput.sqM(3);
    equals(_app.wallsVm.internalAdjustments()[0].totalIsCalculated(), false, "Computed correctly");
    _app.planningVm.unitsSystem("Imperial");
    equals(_app.wallsVm.internalAdjustments()[0].totalIsCalculated(), true, "Computed correctly");
    _app.wallsVm.internalAdjustments()[0].totalSizeInput.sqFt(3);
    equals(_app.wallsVm.internalAdjustments()[0].totalIsCalculated(), false, "Computed correctly");

});