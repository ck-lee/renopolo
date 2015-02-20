var cks = cks || {};
cks.viewModels = cks.viewModels || {};
cks.viewModels.planning = function () {
    var _title = ko.observable();
    var _unitsSystem = ko.observable("Metric");
    var _createdDate = ko.observable();
    var _id = ko.observable();
    var _continueUnitsSystemCallback;
    var _lastUnitsSystemSelection = function () {
        if (_unitsSystem() === "Metric") {
            return "metriclUnitsSystem";
        } else {
            return "imperialUnitsSystem";
        }
    };
    var _resetUnitsSystemActiveClass = function (value) {
        $("#metriclUnitsSystem").removeClass("active");
        $("#imperialUnitsSystem").removeClass("active");
        if (value) {
            $("#" + value).addClass("active");
        }
    };

    var _unitsSystemAlert = function (callback) {
        if (app.traceEstimateVm.walls().length > 0) {
            $("#unitsSystemAlert").show();
            _continueUnitsSystemCallback = callback;
        } else {
            callback();
        }
    };


    var _continueUnitsSystemAlertClicked = function () {
        $("#unitsSystemAlert").hide();
        _continueUnitsSystemCallback();
        _resetUnitsSystemActiveClass(_lastUnitsSystemSelection());
    };

    var _cancelUnitsSystemAlertClicked = function () {
        $("#unitsSystemAlert").hide();
        _resetUnitsSystemActiveClass(_lastUnitsSystemSelection());
    };

    var _metricClicked = function () {
        _unitsSystemAlert(function () {
            _unitsSystem("Metric");
            if (app.traceEstimateVm.lastFloorPlanSelection() === "withoutFloorPlan") {
                app.tracer.loadBlankBackground();
            } else if (app.traceEstimateVm.lastFloorPlanSelection() === "uploadFloorPlan") {
                app.tracer.loadUserBackground();
            } else {
                app.tracer.loadSampleBackground();
            }
            app.traceEstimateVm.walls([]);
            app.tracer.walls([]);
        });
    };

    var _imperialClicked = function () {
        _unitsSystemAlert(function () {
            _unitsSystem("Imperial");
            if (app.traceEstimateVm.lastFloorPlanSelection() === "withoutFloorPlan") {
                app.tracer.loadBlankBackground();
            } else if (app.traceEstimateVm.lastFloorPlanSelection() === "uploadFloorPlan") {
                app.tracer.loadUserBackground();
            } else {
                app.tracer.loadSampleBackground();
            }
            app.traceEstimateVm.walls([]);
            app.tracer.walls([]);
        });
    };
    return {
        title: _title,
        unitsSystem: _unitsSystem,
        createdDate: _createdDate,
        id: _id,
        metricClicked: _metricClicked,
        imperialClicked: _imperialClicked,
        cancelUnitsSystemAlertClicked: _cancelUnitsSystemAlertClicked,
        continueUnitsSystemAlertClicked: _continueUnitsSystemAlertClicked
    };
};