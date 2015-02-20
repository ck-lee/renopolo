module("cks.meausurement");
test("getFtInDisplay", 5, function () {
    var _measurements = cks.measurements();
    equals(_measurements.getFtInDisplay(11.1667), "11' 2\"", "Display correctly");
    equals(_measurements.getFtInDisplay(12), "12' 0\"", "Display correctly");
    equals(_measurements.getFtInDisplay(12.90), "12' 11\"", "Display correctly");
    equals(_measurements.getFtInDisplay(-12.90), undefined, "Negative value returns undefined");
    equals(_measurements.getFtInDisplay("abc"), undefined, "NaN value returns undefined");
});
test("getCmInDisplay", 5, function () {
    var _measurements = cks.measurements();
    equals(_measurements.getCmInDisplay(11.1667), "11 cm", "Display correctly");
    equals(_measurements.getCmInDisplay(12), "12 cm", "Display correctly");
    equals(_measurements.getCmInDisplay(12.90), "13 cm", "Display correctly");
    equals(_measurements.getCmInDisplay(-12.90), undefined, "Negative value returns undefined");
    equals(_measurements.getCmInDisplay("abc"), undefined, "NaN value returns undefined");
});
test("getAreaFtInDisplay", 5, function () {
    var _measurements = cks.measurements();
    equals(_measurements.getAreaFtInDisplay(11.1667), "11 sq ft", "Display correctly");
    equals(_measurements.getAreaFtInDisplay(12), "12 sq ft", "Display correctly");
    equals(_measurements.getAreaFtInDisplay(12.90), "13 sq ft", "Display correctly");
    equals(_measurements.getAreaFtInDisplay(-12.90), undefined, "Negative value returns undefined");
    equals(_measurements.getAreaFtInDisplay("abc"), undefined, "NaN value returns undefined");
});
test("getAreaCmInDisplay", 5, function () {
    var _measurements = cks.measurements();
    equals(_measurements.getAreaCmInDisplay(111667), "11.17 m²", "Display correctly");
    equals(_measurements.getAreaCmInDisplay(120000), "12.00 m²", "Display correctly");
    equals(_measurements.getAreaCmInDisplay(129000), "12.90 m²", "Display correctly");
    equals(_measurements.getAreaCmInDisplay(-129000), undefined, "Negative value returns undefined");
    equals(_measurements.getAreaCmInDisplay("abc"), undefined, "NaN value returns undefined");
});
test("calculateDistance", 5, function () {
    var _measurements = cks.measurements();
    equals(_measurements.calculateDistance(1,2,3,4), 3, "Display correctly");
    equals(_measurements.calculateDistance(5, 5, 5, 5), 0, "Display correctly");
    equals(_measurements.calculateDistance(5.9, 5, 5, 5), 1, "Display correctly");
    equals(_measurements.calculateDistance(-12.90, 5, 5, 5), undefined, "Negative value returns undefined");
    equals(_measurements.calculateDistance("abc", 5, 5, 5), undefined, "NaN value returns undefined");
});
test("calculateActualLengthRatio", 5, function () {
    var _measurements = cks.measurements();
    equals(_measurements.calculateActualLengthRatio(30, 1, 2, 3, 4), 10, "Calculate correctly");
    equals(_measurements.calculateActualLengthRatio(30, 5, 5, 6, 5), 30, "Calculate correctly");
    equals(_measurements.calculateActualLengthRatio(30, 5.9, 5, 5, 5), 30, "Calculate correctly");
    equals(_measurements.calculateActualLengthRatio(30 , - 12.90, 5, 5, 5), undefined, "Negative value returns undefined");
    equals(_measurements.calculateActualLengthRatio(30, "abc", 5, 5, 5), undefined, "NaN value returns undefined");
});
test("calculateArea", 2, function () {
    var _measurements = cks.measurements();
    equals(_measurements.calculateArea(2, 3), 6, "Calculate correctly");
    equals(_measurements.calculateArea(2.2, 3.3), 7.26, "Calculate correctly");
});
test("calculateLengthInCmFromInputs", 2, function () {
    var _measurements = cks.measurements();
    equals(_measurements.calculateLengthInCmFromInputs("Imperial", null, 2, 3), 68.58, "Calculate correctly");
    equals(_measurements.calculateLengthInCmFromInputs("Metric", 2.2, 3.3, 4.4), 2.2, "Calculate correctly");
}); 
test("calculateAreaInSqMFromInputs", 2, function () {
    var _measurements = cks.measurements();
    equals(_measurements.calculateAreaInSqMFromInputs("Imperial", null, 200), 18.5806, "Calculate correctly");
    equals(_measurements.calculateAreaInSqMFromInputs("Metric", 2.2, 3.3), 2.2, "Calculate correctly");
}); 
test("convertCmToFt", 1, function () {
    var _measurements = cks.measurements();
    equals(_measurements.convertCmToFt(1), 0.0328084, "Calculate correctly");
});
test("convertFtToCm", 1, function () {
    var _measurements = cks.measurements();
    equals(_measurements.convertFtToCm(1), 30.48, "Calculate correctly");
});
test("convertSqCmToSqFt", 1, function () {
    var _measurements = cks.measurements();
    equals(_measurements.convertSqCmToSqFt(1), 0.00107639104, "Calculate correctly");
});
test("convertSqCmToSqM", 1, function () {
    var _measurements = cks.measurements();
    equals(_measurements.convertSqCmToSqM(1), 0.0001, "Calculate correctly");
});
test("convertSqMToSqCm", 1, function () {
    var _measurements = cks.measurements();
    equals(_measurements.convertSqMToSqCm(1), 10000, "Calculate correctly");
});
test("convertSqFtToSqM", 1, function () {
    var _measurements = cks.measurements();
    equals(_measurements.convertSqFtToSqM(1), 0.092903, "Calculate correctly");
});
test("convertSqMToSqFt", 1, function () {
    var _measurements = cks.measurements();
    equals(_measurements.convertSqMToSqFt(1), 10.7639, "Calculate correctly");
});
test("getMeasurementInDisplay", 2, function () {
    var _measurements = cks.measurements();
    equals(_measurements.getMeasurementInDisplay(200, "Imperial"), "6' 7\"", "Calculate correctly");
    equals(_measurements.getMeasurementInDisplay(2, "Metric"), "2 cm", "Calculate correctly");
});
test("getAreaInDisplay", 4, function () {
    var _measurements = cks.measurements();
    equals(_measurements.getAreaInDisplay(20, "Imperial", true), "215 sq ft", "Calculate correctly");
    equals(_measurements.getAreaInDisplay(2, "Metric", true), "2 m²", "Calculate correctly");
    equals(_measurements.getAreaInDisplay(2000, "Imperial", false), "2 sq ft", "Calculate correctly");
    equals(_measurements.getAreaInDisplay(2000, "Metric", false), "0.20 m²", "Calculate correctly");
});
test("tryToFixed2Decimal", 7, function () {
    var _measurements = cks.measurements();
    equals(_measurements.tryToFixed2Decimal(200), "200.00", "Calculate correctly");
    equals(_measurements.tryToFixed2Decimal(2.1234), "2.12", "Calculate correctly");
    equals(_measurements.tryToFixed2Decimal("2.1234"), "2.12", "Calculate correctly");
    equals(_measurements.tryToFixed2Decimal("abc"), undefined, "Calculate correctly");
    equals(_measurements.tryToFixed2Decimal("2.12.23"), undefined, "Calculate correctly");
    equals(_measurements.tryToFixed2Decimal(undefined), undefined, "Calculate correctly");
    equals(_measurements.tryToFixed2Decimal(0), 0.00, "Calculate correctly");
});
test("tryParseFloat", 7, function () {
    var _measurements = cks.measurements();
    equals(_measurements.tryParseFloat(200), 200, "Calculate correctly");
    equals(_measurements.tryParseFloat(2.1234), 2.1234, "Calculate correctly");
    equals(_measurements.tryParseFloat("2.1234"), 2.1234, "Calculate correctly");
    equals(_measurements.tryParseFloat("abc"), undefined, "Calculate correctly");
    equals(_measurements.tryParseFloat("2.12.23"), undefined, "Calculate correctly");
    equals(_measurements.tryParseFloat(undefined), undefined, "Calculate correctly");
    equals(_measurements.tryParseFloat(0), 0, "Calculate correctly");
});