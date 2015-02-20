var cks = cks || {};
cks.viewModels = cks.viewModels || {};
cks.viewModels.index = function () {
    var _location = ko.observable();
    var _located = ko.observable(false);
    return {
        location: _location,
        located: _located
    };
};