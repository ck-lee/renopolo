var cks = cks || {};
cks.viewModels = cks.viewModels || {};
cks.viewModels.login = function () {
    var _observablesWithValidation = ko.observableArray();
    var _checkAllFieldsAreValid = function () {
        var _allFieldsAreValid = true;
        $.each(_observablesWithValidation(), function (index, observable) {
            observable.isTriggered(true);
        });
        $.each(_observablesWithValidation(), function (index, observable) {
            if (observable.isValid() === false) {
                _allFieldsAreValid = false;
            }
        });
        return _allFieldsAreValid;
    };

    var _userName = ko.observable();
    var _password = ko.observable();
    var _rememberMe = ko.observable();
    var _response = ko.observable();
    var _isLoading = ko.observable(false);
    var _userIsSignedIn = ko.observable();
    var _lastUrl = ko.observable();
    
    var _loginClicked = function () {
        if (_checkAllFieldsAreValid() === false) {
            return;
        }
        _isLoading(true);
        var _data = { "email": _userName(), "password": _password(), "rememberMe": _rememberMe() };
        var _service = cks.services.ajax({
            url: "/api/account/Login/",
            type: "post",
            data: _data
        }
);
        _service.success(function(response) {
            if (response) {
                if (response.successful === true) {
                    _password.isValid(true);
                    _password.validationMessage(undefined);
                    _userIsSignedIn(true);
                    _response(response); //needed to populate displayName
                    cks.transitions.signInSuccessful(_lastUrl());
                }
            }
        }).error(function(response) {
            if (response) {
                _response(response);
                _password.isValid(false);
                _password.validationMessage(response.errorMessage);
            } else {
                _userIsSignedIn(false);
                $.pnotify({
                    title: 'Oops',
                    text: "We can't seem to sign you in right now. Please try again later",
                    type: 'error'
                });

            }
        }).complete(function() {
            _isLoading(false);
        });

    };
 
    _userName.extend({
        validations: {
            rules: [{ validationFunction: cks.validations.requiredField, errorMessage: "Please enter your e-mail address.", triggerOnly: true },
                    { validationFunction: cks.validations.emailField, errorMessage: "Please check your email address. It's not the right format"}],
            watch: _observablesWithValidation
        }
    });
    _password.extend({
        validations: {
            rules: [{ validationFunction: cks.validations.requiredField, errorMessage: "Please enter your password.", triggerOnly: true }],
        watch: _observablesWithValidation
    }});
    
    return {
        userName: _userName,
        password: _password,
        rememberMe: _rememberMe,
        loginClicked: _loginClicked,
        response: _response,
        isLoading: _isLoading,
        userIsSignedIn: _userIsSignedIn,
        lastUrl: _lastUrl
    };
};