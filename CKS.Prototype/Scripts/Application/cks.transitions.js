var cks = cks || {};
cks.transitions = {};
cks.transitions.post = {};

cks.transitions.signInSuccessful = function (lastUrl) {
    $("#login-view").find("a.login-button").animate({ marginLeft: 1500 }, function () {
        if (lastUrl)
            window.location.href = lastUrl;
        else
            window.location.href = "/";
    });
};

cks.transitions.registerSuccessful = function (lastUrl) {
    $("#register-view").find("a.register-button").animate({ marginLeft: 1500 }, function () {
        if (lastUrl)
            window.location.href = lastUrl;
        else
            window.location.href = "/";
    });
};

cks.transitions.signIn = function () {
    $("#login-link").addClass("disabled");
    $("#register-link").removeClass("disabled");
    $("#login-view").find("a.login-button").animate({ marginLeft: 0 });
};

cks.transitions.register = function () {
    $("#login-link").removeClass("disabled");
    $("#register-link").addClass("disabled");
    $("#register-view").find("a.register-button").animate({ marginLeft: 0 });
};

cks.transitions.post.init = function () {
    $("#plan-step2").hide();
    $("#plan-step3").hide();
    $("#plan-step4").hide();
    $("#plan-step2").css("margin-left", "-1000px");
    $("#plan-step3").css("margin-left", "-1000px");
    $("#plan-step4").css("margin-left", "-1000px");
    $("#plan-step1").animate({ marginLeft: 0 });
    $("#plan-view").show();
    $("#plan-view").find("a.post-button").animate({ marginLeft: 0 });
};

cks.transitions.showStep = function (id) {
    if ($(id).css("margin-left") === "0px") {
        return;
    }
    $(id).show();
    $(id).animate({ marginLeft: 0 });
};

cks.transitions.hideToLeft = function (idToHide, idToShow) {
    if ($(idToHide).css("margin-left") === "0px") {
        $(idToHide).animate({ marginLeft: -1000 }, function () {
            $(idToHide).hide();
            cks.transitions.showStep(idToShow);
        });
    }
};

cks.transitions.hideToRight = function (idToHide, idToShow) {
    if ($(idToHide).css("margin-left") === "0px") {
        $(idToHide).animate({ marginLeft: 1000 }, function () {
            $(idToHide).hide();
            cks.transitions.showStep(idToShow);
        });
    }
};

cks.transitions.post.s1 = function () {
    $("#tracerUndo").hide();
    cks.transitions.hideToLeft("#plan-step4", "#plan-step1");
    cks.transitions.hideToLeft("#plan-step3", "#plan-step1");
    cks.transitions.hideToLeft("#plan-step2", "#plan-step1");
};

cks.transitions.post.s2 = function () {
    cks.transitions.hideToRight("#plan-step1", "#plan-step2");
    cks.transitions.hideToLeft("#plan-step3", "#plan-step2");
    cks.transitions.hideToLeft("#plan-step4", "#plan-step2");
    setTimeout(function () {
        $("#tracerUndo").show();
    }, 750);
    
};

cks.transitions.post.s3 = function () {
    $("#tracerUndo").hide();
    cks.transitions.hideToRight("#plan-step1", "#plan-step3");
    cks.transitions.hideToRight("#plan-step2", "#plan-step3");
    cks.transitions.hideToLeft("#plan-step4", "#plan-step3");
};

cks.transitions.post.s4 = function () {
    $("#tracerUndo").hide();
    cks.transitions.hideToRight("#plan-step1", "#plan-step4");
    cks.transitions.hideToRight("#plan-step2", "#plan-step4");
    cks.transitions.hideToRight("#plan-step3", "#plan-step4");
};

cks.transitions.refreshPage = function () {
    app.routerApp.runRoute("get", window.location.hash);
};

cks.transitions.highlightMenu = function (title) {
    $("#styled-navbar a:contains('" + title + "')").addClass("black");
    $("#styled-navbar a").not(":contains('" + title + "')").removeClass("black");
};

cks.transitions.hideProjectListWhenClickedOutside = function (projectSelectionVm) {
    $(document).mouseup(function (e) {
        if ($("#project-selection").has(e.target).length === 0 && $("#project-list").has(e.target).length === 0) {
            projectSelectionVm.hideProjectList();
        }
    });
};

cks.transitions.loadingOn = function () {
    var _docHeight = $(document).height();
    $("<div/>", {
        id: 'loading-overlay',
        height: _docHeight,
        css: {
            'opacity': 0.4,
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'background-color': 'black',
            'width': '100%',
            'z-index': 5000,
            'cursor': 'progress'
        }
    }).appendTo("body");
};

cks.transitions.loadingOff = function () {
    $('#loading-overlay').remove();
};

cks.transitions.scrollToError = function () {
    if ($(".control-group.error").length > 0)
        $("html, body").animate({ scrollTop: $(".control-group.error").offset().top - 50}, "slow");
    else if($(".field-validation-error").length > 0) {
        $("html, body").animate({ scrollTop: $(".field-validation-error").offset().top - 50 }, "slow");
    }    
};