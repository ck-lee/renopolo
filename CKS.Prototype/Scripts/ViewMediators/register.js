var cks = cks || {};
cks.viewMediators = cks.viewMediators || {};
cks.viewMediators.register = function (registerVm) {
    var _$content = $("div#content");
    ko.applyBindings(registerVm, _$content.find("div#register-view")[0]);
};