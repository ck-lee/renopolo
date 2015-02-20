var cks = cks || {};
cks.helpers = {};
cks.helpers.mockApplication = function () {
    cks.router = function () {
        return {
            app: {
                run: function(){}
            }
        };
    };
    $.pnotify = function (obj) {
        cks.helpers.pnotifyObject = obj;
    };
    return cks.application();
};

cks.helpers.mockSuccessService = function (data) {
    cks.services.realAjax = cks.services.ajax;
    var _deferred = $.Deferred();
    cks.services.ajax = function () {
        var _promise = _deferred.promise();
        _promise.success = _deferred.done;
        _promise.error = _deferred.fail;
        _promise.complete = _deferred.always;
        return _promise;
    };
    _deferred.resolve(data);
};

cks.helpers.mockErrorService = function (data) {
    cks.services.realAjax = cks.services.ajax;
    var _deferred = $.Deferred();
    cks.services.ajax = function () {
        var _promise = _deferred.promise();
        _promise.success = _deferred.done;
        _promise.error = _deferred.fail;
        _promise.complete = _deferred.always;
        return _promise;
    };
    _deferred.reject(data);
};

cks.helpers.unmockService = function () {
    cks.services.ajax = cks.services.realAjax;
};

