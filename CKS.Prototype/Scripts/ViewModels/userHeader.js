var cks = cks || {};
cks.viewModels = cks.viewModels || {};
cks.viewModels.userHeader = function (loginVm) {
    var _userName = ko.computed(function() {
        if(!loginVm || !loginVm.response())
            return "";
        return loginVm.response().displayName || "";
    });
    var _signOutClicked = function () {
        $.post("/api/account/SignOut/", 
            function () {
                loginVm.userIsSignedIn(false);
                cks.transitions.refreshPage();
            }).error(function () {
                //TODO: change to modal dialog
                alert("Uh Oh. We can't seem to sign you out right now. Give it another shot later or report the problem to us.");                
            }).complete(function () {
                
            });        
    };
    return {
        userName: _userName,
        signOutClicked: _signOutClicked
    };
};