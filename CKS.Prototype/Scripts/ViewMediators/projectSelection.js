var cks = cks || {};
cks.viewMediators = cks.viewMediators || {};
cks.viewMediators.projectSelection = function (projectSelectionVm) {
    var _$content = $("#project-selection,#project-list");
    ko.applyBindings(projectSelectionVm, _$content[0]);
    ko.applyBindings(projectSelectionVm, _$content[1]);
};