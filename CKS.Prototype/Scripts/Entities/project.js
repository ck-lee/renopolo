var cks = cks || {};
cks.entities = cks.entities || {};
cks.entities.project = function (planningVm, traceEstimateVm, wallsVm, sectionsEntity) {
    var _toJs = function () {
        return {
            title: planningVm.title(),
            systemOfMeasurement: planningVm.unitsSystem(),
            sections: sectionsEntity.toJs(),
            createdDate: planningVm.createdDate(),
            id: planningVm.id()
        };
    };

    var _toVm = function (project) {
        if (!project) {
            planningVm.title(undefined);
            planningVm.unitsSystem(undefined);
            sectionsEntity.toVm(undefined);
            planningVm.createdDate(undefined);
            planningVm.id(undefined);
            return;
        }
        planningVm.title(project.title);
        planningVm.unitsSystem(project.systemOfMeasurement);
        sectionsEntity.toVm(project.sections);
        planningVm.createdDate(project.createdDate);
        planningVm.id(project.id);
    };
    return {
        toJs: _toJs,
        toVm: _toVm
    };
};