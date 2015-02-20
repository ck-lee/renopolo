var cks = cks || {};
cks.viewModels = cks.viewModels || {};
cks.viewModels.register = function (loginVm) {
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
    var _fullName = ko.observable();
    var _email = ko.observable();
    var _password = ko.observable();
    var _confirmPassword = ko.observable();
    var _isLoading = ko.observable(false);
    
    _fullName.extend({
        validations: {
            rules: [{ validationFunction: cks.validations.requiredField, errorMessage: "Please enter your full name.", triggerOnly: true }],
            watch: _observablesWithValidation
        }
    });
    _email.extend({
        validations: {
            rules: [{ validationFunction: cks.validations.requiredField, errorMessage: "Please enter your e-mail address.", triggerOnly: true },
                    { validationFunction: cks.validations.emailField, errorMessage: "Please check your email address. It's not the right format" }],
            watch: _observablesWithValidation
        }
    });

    var _minLengthCharacters = function (password) {
        if (password) {
            if (password.length >= 7)
                return true;
        }
        return false;
    };

    _password.extend({
        validations: {
            rules: [{ validationFunction: cks.validations.requiredField, errorMessage: "Please enter a password.", triggerOnly: true },
                { validationFunction: _minLengthCharacters, errorMessage: "Please enter a password with 7 or more characters." }],
            watch: _observablesWithValidation,
            depencies: [_confirmPassword]
        }
    });

    var _samePassword = function (confirmPassword) {
        if (confirmPassword === _password())
            return true;
        return false;
    };
    _confirmPassword.extend({
        validations: {
            rules: [{ validationFunction: cks.validations.requiredField, errorMessage: "Please enter the password again.", triggerOnly: true },
                { validationFunction: _samePassword, errorMessage: "Please check your password. They do not match." }],
            watch: _observablesWithValidation,
            dependencies: [_password]
        }
    });

    var _lastUrl = ko.observable();

    var _registerClicked = function () {
        if (_checkAllFieldsAreValid() === false) {
            return;
        }
        _isLoading(true);
        var _data = { "fullname": _fullName(), "password": _password(), "email": _email() };
        $.post("/api/account/Register/", _data,
            function (response) {
                if (response) {
                    loginVm.response(response);
                    if (response.successful === true) {
                        cks.transitions.registerSuccessful(_lastUrl());
                        loginVm.userIsSignedIn(true);
                    }
                    else {
                        _email.isValid(false);
                        _email.validationMessage(response.errorMessage);
                    }
                }
            }).error(function () {
                var _errorResponse = {
                    Successful: false,
                    ErrorMessage: "Uh Oh. We can't seem to register your right now. Give it another shot later or report the problem to us.",
                    DisplayName: null
                };
                loginVm.response(_errorResponse);
            }).complete(function () {
                _isLoading(false);
            });
    };

    return {
        fullName: _fullName,
        email: _email,
        password: _password,
        confirmPassword: _confirmPassword,
        isLoading: _isLoading,
        registerClicked: _registerClicked,
        lastUrl: _lastUrl
    };
};