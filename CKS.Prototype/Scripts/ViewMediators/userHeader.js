var cks = cks || {};
cks.viewMediators = cks.viewMediators || {};
cks.viewMediators.userHeader = function (userHeaderVm) {
    var _$loginSection = $("#login");
    ko.applyBindings(userHeaderVm, _$loginSection[0]);
};