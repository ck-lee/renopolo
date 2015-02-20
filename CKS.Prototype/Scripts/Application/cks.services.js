var cks = cks || {};
cks.services = {};
cks.services.ajax = function (options) {
    if(options.data)
        options.data = JSON.stringify(options.data);
    var _deferred = $.Deferred(function (d) {
        var _defaults = {
            cache: false,
            type: 'post',
            dataType: 'json',
            contentType: "application/json"
        },
        settings = $.extend({}, _defaults, options);

        d.done(settings.success);
        d.fail(settings.error);
        d.done(settings.complete);

        var _jqXhrSettings = $.extend({}, settings, {
            success: function (response, textStatus, jqXHR) {
                if (settings.dataType === 'json') {
                    if (response && response.successful === false) {
                        d.reject(response, jqXHR);
                    } else {
                        d.resolve(response);
                    }
                } else {
                    d.resolve(response);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //console.log(jqXHR);
                d.reject(undefined, jqXHR);
            },
            complete: d.resolve
        });

        $.ajax(_jqXhrSettings);

    });

    var _promise = _deferred.promise();

    _promise.success = _deferred.done;
    _promise.error = _deferred.fail;
    _promise.complete = _deferred.always;

    return _promise;
};