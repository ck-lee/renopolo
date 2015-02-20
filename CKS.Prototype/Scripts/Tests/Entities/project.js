module("cks.entities.project");
test("toJs", 10, function () {
    var _app = cks.helpers.mockApplication();
    _app.planningVm.title("title");
    _app.planningVm.unitsSystem("Metric");
    _app.wallsVm.heightInput.cm(200);
    _app.wallsVm.firstWallLengthInput.cm(400);
    _app.traceEstimateVm.walls([{ "startPoint": { "x": 148, "y": 134 }, "endPoint": { "x": 513, "y": 134 } }, { "startPoint": { "x": 513, "y": 134 }, "endPoint": { "x": 510, "y": 453 } }, { "startPoint": { "x": 513, "y": 453 }, "endPoint": { "x": 401, "y": 454 } }]);

    var _projectJs = _app.entities.project.toJs();
    console.log(JSON.stringify(_projectJs.sections[0].walls));
    equal(_projectJs.sections[0].walls.length, 3, "map object correctly");
    equal(_projectJs.sections[0].walls[0].startPointX, 148, "map object correctly");
    equal(_projectJs.sections[0].walls[0].startPointY, 134, "map object correctly");
    equal(_projectJs.sections[0].walls[0].endPointX, 513, "map object correctly");
    equal(_projectJs.sections[0].walls[0].endPointY, 134, "map object correctly");
    equal(_projectJs.sections[0].walls[0].length, 400, "map object correctly");
    equal(_projectJs.sections[0].walls[0].height, 200, "map object correctly");
    equal(_projectJs.sections[0].name, "Default", "map object correctly");
    equal(_projectJs.title, "title", "map object correctly");
    equal(_projectJs.systemOfMeasurement, "Metric", "map object correctly");

});