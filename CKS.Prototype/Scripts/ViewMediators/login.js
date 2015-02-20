var cks = cks || {};
cks.viewMediators = cks.viewMediators || {};
cks.viewMediators.login = function (loginVm) {
    var _$content = $("div#content");
    ko.applyBindings(loginVm, _$content.find("div#login-view")[0]);
};