module("cks.viewModels.traceEstimate");

test("calculatedWallsMetric", 10, function () {
    var _app = cks.helpers.mockApplication();
    _app.planningVm.unitsSystem("Metric");
    equals(_app.traceEstimateVm.calculatedWalls().length, 0, "Initial number of walls is correct");
    _app.wallsVm.heightInput.cm(200);
    equals(_app.wallsVm.height(), 200, "Initial metric height value is correct");
    _app.wallsVm.firstWallLengthInput.cm(400);
    _app.traceEstimateVm.walls([{ "startPoint": { "x": 148, "y": 134 }, "endPoint": { "x": 513, "y": 134 } }, { "startPoint": { "x": 513, "y": 134 }, "endPoint": { "x": 510, "y": 453 } }, { "startPoint": { "x": 513, "y": 453 }, "endPoint": { "x": 401, "y": 454 } }]);
    equals(_app.traceEstimateVm.calculatedWalls().length, 3, "Number of walls computed correctly (Metric)");
    deepEqual(_app.traceEstimateVm.calculatedWalls()[0].length, {
        "display": "400 cm",
        "cm": 400,
        "ft": 13.12336
    }, "First wall length computed correctly (Metric)");
    deepEqual(_app.traceEstimateVm.calculatedWalls()[0].area, {
        "display": "8.00 m²",
        "sqCm": 80000,
        "sqFt": 86.1112832,
        "sqM": 8
    }, "First wall area computed correctly (Metric)");
    deepEqual(_app.traceEstimateVm.calculatedWalls()[0].points, {
        "startPoint": { x: 148, y: 134 },
        "endPoint": { x: 513, y: 134 }
    }, "First wall points computed correctly");
    deepEqual(_app.traceEstimateVm.calculatedWalls()[1].length, {
        "display": "350 cm",
        "cm": 349.58904109589037,
        "ft": 11.46945709589041
    }, "Second wall length computed correctly (Metric)");
    deepEqual(_app.traceEstimateVm.calculatedWalls()[1].area, {
        "display": "6.99 m²",
        "sqCm": 69917.80821917807,
        "sqFt": 75.25890230356163,
        "sqM": 6.991780821917807
    }, "Second wall area computed correctly (Metric)");
    deepEqual(_app.traceEstimateVm.calculatedWalls()[2].length, {
        "display": "123 cm",
        "cm": 122.73972602739725,
        "ft": 4.02689402739726
    }, "Third wall length correctly (Metric)");
    deepEqual(_app.traceEstimateVm.calculatedWalls()[2].area, {
        "display": "2.45 m²",
        "sqCm": 24547.94520547945,
        "sqFt": 26.423188269589037,
        "sqM": 2.454794520547945
    }, "Third wall area computed correctly (Metric)");

});
test("calculatedWallsImperial", 8, function () {
    var _app = cks.helpers.mockApplication();
    _app.planningVm.unitsSystem("Imperial");
    _app.wallsVm.heightInput.ft(6);
    _app.wallsVm.heightInput.in(9);
    equals(_app.wallsVm.height(), 6.75, "Initial imperial height value is correct");
    _app.wallsVm.firstWallLengthInput.ft(40);
    _app.wallsVm.firstWallLengthInput.in(1);
    _app.traceEstimateVm.walls([{ "startPoint": { "x": 148, "y": 134 }, "endPoint": { "x": 513, "y": 134 } }, { "startPoint": { "x": 513, "y": 134 }, "endPoint": { "x": 510, "y": 453 } }, { "startPoint": { "x": 513, "y": 453 }, "endPoint": { "x": 401, "y": 454 } }]);
    deepEqual(_app.traceEstimateVm.calculatedWalls()[0].length, {
        "display": "40' 1\"",
        "cm": 1221.74,
        "ft": 40.083334616
    }, "First wall length computed correctly (Imperial)");
    deepEqual(_app.traceEstimateVm.calculatedWalls()[0].area, {
        "display": "271 sq ft",
        "sqCm": 251360.7876,
        "sqFt": 270.5624995799831,
        "sqM": 25.136078760000004
    }, "First wall area computed correctly (Imperial)");
    deepEqual(_app.traceEstimateVm.calculatedWalls()[0].points, {
        "startPoint": { x: 148, y: 134 },
        "endPoint": { x: 513, y: 134 }
    }, "First wall points computed correctly");
    deepEqual(_app.traceEstimateVm.calculatedWalls()[1].length, {
        "display": "35' 0\"",
        "cm": 1067.767287671233,
        "ft": 35.03173628083288
    }, "Second wall length computed correctly (Imperial)");
    deepEqual(_app.traceEstimateVm.calculatedWalls()[1].area, {
        "display": "236 sq ft",
        "sqCm": 219682.44176547948,
        "sqFt": 236.46421196168387,
        "sqM": 21.968244176547948
    }, "Second wall area computed correctly (Imperial)");
    deepEqual(_app.traceEstimateVm.calculatedWalls()[2].length, {
        "display": "12' 4\"",
        "cm": 374.89008219178083,
        "ft": 12.299543772580822
    }, "Third wall length computed correctly (Imperial)");
    deepEqual(_app.traceEstimateVm.calculatedWalls()[2].area, {
        "display": "83 sq ft",
        "sqCm": 77129.885510137,
        "sqFt": 83.02191767933729,
        "sqM": 7.712988551013701
    }, "Third wall area computed correctly (Imperial)");
});
test("internalWalls & externalWalls", 2, function () {
    var _app = cks.helpers.mockApplication();
    _app.planningVm.unitsSystem("Imperial");
    _app.wallsVm.heightInput.ft(6);
    _app.wallsVm.heightInput.in(9);
    _app.wallsVm.firstWallLengthInput.ft(40);
    _app.wallsVm.firstWallLengthInput.in(1);
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
    equal(_app.traceEstimateVm.exteriorWalls().length, 4, "Filtered walls correctly");
    equal(_app.traceEstimateVm.internalWalls().length, 2, "Filtered walls correctly");
});

test("various Display Functions", 19, function () {
    var _app = cks.helpers.mockApplication();
    _app.planningVm.unitsSystem("Imperial");
    _app.wallsVm.heightInput.ft(6);
    _app.wallsVm.heightInput.in(9);
    _app.wallsVm.firstWallLengthInput.ft(40);
    _app.wallsVm.firstWallLengthInput.in(1);
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
    equal(_app.traceEstimateVm.wallsGrossMeasuredAreaDisplay(_app.traceEstimateVm.internalWalls()), "505 sq ft", "Display value correctly");
    equal(_app.traceEstimateVm.exteriorWallsNetSurfaceAreaDisplay(), "1019<span style=\"font-size: 0.4em;\"> sq ft<span>", "Display value correctly");
    equal(_app.traceEstimateVm.internalWallsNetSurfaceAreaDisplay(), "1010<span style=\"font-size: 0.4em;\"> sq ft<span>", "Display value correctly");
    equal(_app.traceEstimateVm.wallsTotalLengthDisplay(_app.traceEstimateVm.internalWalls()), "74' 10\"");
    equal(_app.traceEstimateVm.interiorWallsNetSurfaceAreaDisplay(), "2029<span style=\"font-size: 0.4em;\"> sq ft<span>", "Display value correctly");
    equal(_app.traceEstimateVm.exteriorWallNetTotalAreaSqCm(), 946614.0298978725, "Computed value correctly");
    equal(_app.traceEstimateVm.internalWallNetTotalAreaSqCm(), 938591.8771021278, "Computed value correctly");
    equal(_app.traceEstimateVm.interiorWallNetTotalAreaSqCm(), 1885205.9070000001, "Computed value correctly");
    
    _app.wallsVm.doubleSurfaceArea(false);
    equal(_app.traceEstimateVm.interiorWallsNetSurfaceAreaDisplay(), "1524<span style=\"font-size: 0.4em;\"> sq ft<span>", "Display value correctly");
    _app.wallsVm.doubleSurfaceArea(true);
    
    _app.wallsVm.heightInput.cm(300);
    _app.wallsVm.firstWallLengthInput.cm(1000);
    _app.planningVm.unitsSystem("Metric");
    equal(_app.traceEstimateVm.wallsGrossMeasuredAreaDisplay(_app.traceEstimateVm.internalWalls()), "56.01 m²", "Display value correctly");
    equal(_app.traceEstimateVm.exteriorWallsNetSurfaceAreaDisplay(), "112.98<span style=\"font-size: 0.4em;\"> m²<span>", "Display value correctly");
    equal(_app.traceEstimateVm.internalWallsNetSurfaceAreaDisplay(), "112.02<span style=\"font-size: 0.4em;\"> m²<span>", "Display value correctly");
    equal(_app.traceEstimateVm.wallsTotalLengthDisplay(_app.traceEstimateVm.internalWalls()), "1867 cm");
    equal(_app.traceEstimateVm.interiorWallsNetSurfaceAreaDisplay(), "225.00<span style=\"font-size: 0.4em;\"> m²<span>", "Display value correctly");
    equal(_app.traceEstimateVm.exteriorWallNetTotalAreaSqCm(), 1129787.2340425532, "Computed value correctly");
    equal(_app.traceEstimateVm.internalWallNetTotalAreaSqCm(), 1120212.7659574468, "Computed value correctly");
    equal(_app.traceEstimateVm.interiorWallNetTotalAreaSqCm(), 2250000, "Computed value correctly");
    _app.wallsVm.doubleSurfaceArea(false);
    equal(_app.traceEstimateVm.internalWallNetTotalAreaSqCm(), 560106.3829787234, "Computed value correctly");
    equal(_app.traceEstimateVm.interiorWallsNetSurfaceAreaDisplay(), "168.99<span style=\"font-size: 0.4em;\"> m²<span>", "Display value correctly");
    
});