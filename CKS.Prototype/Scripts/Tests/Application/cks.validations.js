module("cks.validations");
test("requiredField", 5, function () {
    equals(cks.validations.requiredField(), false, "Validates correctly");
    equals(cks.validations.requiredField(undefined), false, "Validates correctly");
    equals(cks.validations.requiredField(""), false, "Validates correctly");
    equals(cks.validations.requiredField(" "), false, "Validates correctly");
    equals(cks.validations.requiredField("a"), true, "Validates correctly");
});
test("emailField", 2, function () {
    equals(cks.validations.emailField("ABC@anc.com"), true, "Validates correctly");
    equals(cks.validations.emailField("ABCanc.com"), false, "Validates correctly");
});
test("numberOnly", 6, function () {
    equals(cks.validations.numberOnly("a"), false, "Validates correctly");
    equals(cks.validations.numberOnly(undefined), false, "Validates correctly");
    equals(cks.validations.numberOnly(), false, "Validates correctly");
    equals(cks.validations.numberOnly(1 / 2), true, "Validates correctly");
    equals(cks.validations.numberOnly(7), true, "Validates correctly");
    equals(cks.validations.numberOnly(1), true, "Validates correctly");
});
test("requiredFieldForMeasurement", 4, function () {
    equals(cks.validations.requiredFieldForMeasurement("Metric",10,undefined,undefined), true, "Validates correctly");
    equals(cks.validations.requiredFieldForMeasurement("Imperial", undefined, 10, 10), true, "Validates correctly");
    equals(cks.validations.requiredFieldForMeasurement("Metric", undefined, undefined, undefined), false, "Validates correctly");
    equals(cks.validations.requiredFieldForMeasurement("Imperial", undefined, undefined, undefined), false, "Validates correctly");
});
test("numberOnlyForMeasurement", 11, function () {
    equals(cks.validations.numberOnlyForMeasurement("Metric", 10, undefined, undefined), true, "Validates correctly");
    equals(cks.validations.numberOnlyForMeasurement("Imperial", undefined, 10, 10), true, "Validates correctly");
    equals(cks.validations.numberOnlyForMeasurement("Metric", undefined, undefined, undefined), true, "Validates correctly");
    equals(cks.validations.numberOnlyForMeasurement("Imperial", undefined, undefined, undefined), true, "Validates correctly");
    equals(cks.validations.numberOnlyForMeasurement("Imperial", undefined, 10, undefined), true, "Validates correctly");
    equals(cks.validations.numberOnlyForMeasurement("Imperial", undefined, undefined, 10), true, "Validates correctly");
    equals(cks.validations.numberOnlyForMeasurement("Metric","abc", undefined, undefined), false, "Validates correctly");
    equals(cks.validations.numberOnlyForMeasurement("Imperial", undefined, "abc", 12), false, "Validates correctly");
    equals(cks.validations.numberOnlyForMeasurement("Imperial", undefined, 12, "abc"), false, "Validates correctly");
    equals(cks.validations.numberOnlyForMeasurement("Imperial", undefined, "abc", "abc"), false, "Validates correctly");
    equals(cks.validations.numberOnlyForMeasurement("Imperial", 12, "abc", "abc"), false, "Validates correctly");
});
test("inchIsValid", 5, function () {
    equals(cks.validations.inchIsValid("Metric", 15), true, "Validates correctly");
    equals(cks.validations.inchIsValid("Metric", undefined), true, "Validates correctly");
    equals(cks.validations.inchIsValid("Imperial", 11), true, "Validates correctly");
    equals(cks.validations.inchIsValid("Imperial", 12), false, "Validates correctly");
    equals(cks.validations.inchIsValid("Imperial", undefined), true, "Validates correctly");
});
test("computedFromInput", 4, function () {
    equals(cks.validations.computedFromInput("Metric", 15, undefined, undefined), 15, "Validates correctly");
    equals(cks.validations.computedFromInput("Metric", undefined, undefined, undefined), undefined, "Validates correctly");
    equals(cks.validations.computedFromInput("Imperial", undefined, 11, 11), 11.916666666666666, "Validates correctly");
    equals(cks.validations.computedFromInput("Imperial", undefined, 11, undefined), undefined, "Validates correctly");
});
test("checkFieldsAreValid", 1, function () {
    var _app = cks.helpers.mockApplication();
    equals(cks.validations.checkFieldsAreValid(_app.wallsVm.observablesWithValidation), false, "Validates correctly");
});
