module("cks.viewModels.post");

asyncTest("step2ContinueClickedSuccess", 2, function () {
    var _app = cks.helpers.mockApplication();
    _app.planningVm.unitsSystem("Metric");
    _app.wallsVm.heightInput.cm(200);
    _app.wallsVm.firstWallLengthInput.cm(400);    
    _app.traceEstimateVm.lastFloorPlanSelection("sampleFloorPlan");
    _app.traceEstimateVm.walls([{"startPoint":{"x":156,"y":139},"endPoint":{"x":531,"y":139},"wallType":"Internal"}]);
    cks.helpers.mockSuccessService({ "sectionId": 40138, "successful": true });
    _app.postVm.step2ContinueClicked();
    equal(window.location.hash, "#!/post/step3", "Transition to step3 correctly");
    equal(_app.wallsVm.sectionId(), 40138, "sectionId is set correctly");
    cks.services.ajax().complete(function () {
        start();
        cks.helpers.unmockService();
    });  
});

asyncTest("step2ContinueClickedError", 2, function () {
    var _app = cks.helpers.mockApplication();
    _app.planningVm.unitsSystem("Metric");
    _app.wallsVm.heightInput.cm(200);
    _app.wallsVm.firstWallLengthInput.cm(400);
    _app.traceEstimateVm.lastFloorPlanSelection("sampleFloorPlan");
    _app.traceEstimateVm.walls([{ "startPoint": { "x": 156, "y": 139 }, "endPoint": { "x": 531, "y": 139 }, "wallType": "Internal" }]);
    cks.helpers.mockErrorService();
    _app.postVm.step2ContinueClicked();
    equal(window.location.hash, "#!/post/step3", "Transition to step3 correctly");
    deepEqual(cks.helpers.pnotifyObject, {
        title: 'Oops',
        text: 'Your changes might not be saved.',
        type: 'error'
    }, "sectionId is set correctly");
    cks.services.ajax().complete(function () {
        start();
        cks.helpers.unmockService();
    });
});