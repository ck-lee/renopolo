var cks = cks || {};
cks.entities = cks.entities || {};
cks.entities.sections = function (planningVm, traceEstimateVm, wallsVm, wallsEntity, adjustmentsEntity) {
    //TODO: temporarily return single section with name:default
    var _toJs = function() {
        return [{
            name: null,
            walls: wallsEntity.toJs(),
            adjustments: adjustmentsEntity.toJs(),
            id: wallsVm.sectionId(),
            createdDate: wallsVm.sectionCreatedDate(),
            traceType: traceEstimateVm.lastFloorPlanSelection(),
            floorPlanUrl: traceEstimateVm.floorPlanUrl()            
        }];
    };
    var _toVm = function (sections) {
        if (!sections) {
            wallsEntity.toVm(undefined);
            adjustmentsEntity.toVm(undefined);
            wallsVm.sectionId(undefined);
            wallsVm.sectionCreatedDate(undefined);
            traceEstimateVm.lastFloorPlanSelection(undefined);
            traceEstimateVm.floorPlanUrl(undefined);
            return;
        }
        //TODO: only works for default section
        wallsEntity.toVm(sections[0].walls);
        adjustmentsEntity.toVm(sections[0].adjustments);
        wallsVm.sectionId(sections[0].id);
        wallsVm.sectionCreatedDate(sections[0].createdDate);
        traceEstimateVm.lastFloorPlanSelection(sections[0].traceType);
        traceEstimateVm.floorPlanUrl(sections[0].floorPlanUrl);
    };
    return {
        toJs: _toJs,
        toVm: _toVm
    };
};