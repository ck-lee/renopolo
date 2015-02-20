module("cks.services");
var _servicesHelper = function (url, type, data) {
    asyncTest(type + " " + url, function () {
        //debugger
        var _acceptedErrorStatus = [200, 401];
        var _request = cks.services.ajax({
            "url": url,
            "type": type,
            "data": data
        });
        _request.success(function (response) {
            //debugger;
            ok(true, type + " " + url + " has successful response");
            //ok(!!response, type + " " + url + " has some data in the response");
            start();
        }).error(function (response, jqXHR) {
            //debugger;
            var _result = _.contains(_acceptedErrorStatus, jqXHR.status);
            ok(_result, type + " " + url + " has error in response. Status Code" + jqXHR.status + (_result === true ? "is expected." : " is not expected."));
            start();
        }).complete(function (response) {
            //debugger;
        });
    });
};

(function () {
    _servicesHelper("/api/account/Login/", "get", undefined);
    _servicesHelper("/api/account/Login/", "post", { email: "test4@test.com", password: "1234567" });
    _servicesHelper("/api/account/SignOut/", "post", undefined);
    _servicesHelper("/api/account/Register/", "post", { email: "test4@test.com", password: "1234567" });
    _servicesHelper("/api/plan/project/", "put", { project: { title: "test" } });
    _servicesHelper("/api/plan/projects/", "get", undefined);
})();



