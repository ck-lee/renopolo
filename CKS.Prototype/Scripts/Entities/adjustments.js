var cks = cks || {};
cks.entities = cks.entities || {};
cks.entities.adjustments = function (planningVm, traceEstimateVm, wallsVm, tracer) {
    var _toJs = function () {
        var _results = [];
        _.each(wallsVm.internalAdjustments(), function (adjustment, index) {
            _results.push({
                adjustmentType: "Internal",
                adjustmentName: adjustment.selectedType(),
                quantity: adjustment.count(),
                size: adjustment.sizeInSqM(),
                total: adjustment.totalSizeInSqM(),
                id: adjustment.id()
            });
        });
        _.each(wallsVm.exteriorAdjustments(), function (adjustment, index) {
            _results.push({
                adjustmentType: "Exterior",
                adjustmentName: adjustment.selectedType(),
                quantity: adjustment.count(),
                size: adjustment.sizeInSqM(),
                total: adjustment.totalSizeInSqM(),
                id: adjustment.id()
            });
        });
        return _results;
    };
    var _toVm = function (adjustments) {
        if (!adjustments) {
            wallsVm.internalAdjustments([]);
            wallsVm.exteriorAdjustments([]);
            return;
        }
        var _measurements = cks.measurements();
        wallsVm.internalAdjustments([]);
        wallsVm.exteriorAdjustments([]);
        _.each(adjustments, function (adjustment, index) {
            var _adjustment = new cks.viewModels.adjustment(planningVm, wallsVm.exteriorAdjustmentsSelection, wallsVm.internalAdjustmentsSelection, true);
            _adjustment.selectedType(adjustment.adjustmentName);
            _adjustment.count(adjustment.quantity);
            _adjustment.id(adjustment.id);
            _measurements.populateInputFromSqM(_adjustment.sizeInput, planningVm.unitsSystem(), adjustment.size);
            _measurements.populateInputFromSqM(_adjustment.totalSizeInput, planningVm.unitsSystem(), adjustment.total);
            if (adjustment.adjustmentType === "Internal") {
                wallsVm.internalAdjustments.push(_adjustment);
            }
            else if (adjustment.adjustmentType === "Exterior") {                
                wallsVm.exteriorAdjustments.push(_adjustment);
            }
        });        
    };
    return {
        toJs: _toJs,
        toVm: _toVm
    };
}