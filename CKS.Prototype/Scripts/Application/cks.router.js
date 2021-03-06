﻿var cks = cks || {};
cks.router = function (geoLocation, map, indexVm, loginVm, userHeaderVm, registerVm, postVm, projectSelectionVm, resultsVm, tracer, traceResult) {

    Sammy.RenderContext.prototype.load = function (location, options, callback) {
        var context = this;
        var _isFunction = function (obj) { return Object.prototype.toString.call(obj) === "[object Function]"; };
        return this.then(function () {
            var should_cache, cached, is_json, location_array, is_html;
            if (_isFunction(options)) {
                callback = options;
                options = {};
            } else {
                options = $.extend({}, options);
            }
            if (callback) { this.then(callback); }
            if (typeof location === 'string') {
                // it's a path
                is_json = (location.match(/\.json$/) || options.json);
                should_cache = is_json ? options.cache === true : options.cache !== false;
                                context.next_engine = context.event_context.engineFor(location);
                delete options.cache;
                delete options.json;
                if (options.engine) {
                    context.next_engine = options.engine;
                    delete options.engine;
                }
                if (should_cache && (cached = this.event_context.app.templateCache(location))) {
                    return cached;
                }
                is_html = location.match(/\.html$/);
                options.cache = is_html ? false : options.cache;
                this.wait();
                $.ajax($.extend({
                    url: location,
                    data: {},
                    dataType: is_json ? 'json' : 'text',
                    type: 'get',
                    success: function (data) {
                        if (should_cache) {
                            context.event_context.app.templateCache(location, data);
                        }
                        context.next(data);
                    }
                }, options));
                return false;
            } else {
                // it's a dom/jQuery
                if (location.nodeType) {
                    return location.innerHTML;
                }
                if (location.selector) {
                    // it's a jQuery
                    context.next_engine = location.attr('data-engine');
                    if (options.clone === false) {
                        return location.remove()[0].innerHTML.toString();
                    } else {
                        return location[0].innerHTML.toString();
                    }
                }
            }
        });
    };

    var _isAlreadySignedIn;
    var _isPostLoaded = false;
    var _renderLoginSection = function (current) {
        var _renderUserIsSignedIn = function () {
            if (_isAlreadySignedIn !== true) {
                current.load("/Templates/Account/on.html")
                    .replace("#login")
                    .then(function() {
                         cks.viewMediators.userHeader(userHeaderVm);
                    });
                _isAlreadySignedIn = true;
            }
        };
        var _renderUserIsSignedOut = function () {
            if (_isAlreadySignedIn !== false) {
                current.load("/Templates/Account/off.html").replace("#login");
                _isAlreadySignedIn = false;
            }
        };

        //this is to check whether user has tried to sign in once before, then try to sign in once immediately with the server
        if (loginVm.userIsSignedIn() === undefined) {
            var _service = cks.services.ajax({
                url: "/api/account/Login/",
                type: "get"
            });
            _service.success(function (response) {
                if (response) {
                    loginVm.response(response);
                    if (loginVm.response().successful === true) {
                        loginVm.userIsSignedIn(true);
                        _renderUserIsSignedIn();
                    }
                    else {
                        loginVm.userIsSignedIn(false);
                        _renderUserIsSignedOut();
                    }
                }
            }).error(function (response) {
                _renderUserIsSignedOut();
            });
        }
        //this is to check whether user has signed in, then render to show username
        else if (loginVm.userIsSignedIn() === true)
            _renderUserIsSignedIn();
        //this is to check whether user has not signed in, then render to show button to sign in
        else
            _renderUserIsSignedOut();
    };
    var _transitions = function (step) {
        if (step === "2") {
            cks.transitions.post.s2();
        } else if (step === "3") {
            cks.transitions.post.s3();
        } else if (step === "4") {
            cks.transitions.post.s4();
        } else {
            cks.transitions.post.s1();
        }
    };
    var _checkStep = function (context, step, current) {
        if (step !== "1" && $("#plan-view").length === 0) {
            context.redirect("#!/post/step1");
        }
        if (step === "1") {
            _loadPost(current);
            $(".step-container").css('min-height', '380px');
        }
        if (step === "2") {
            $(".step-container").css('min-height', '380px');
        }
        else if (step === "3") {
            $(".step-container").css('min-height', '580px');
            postVm.wallsVm.populateTypicalAdjustmentProperties();
        }
        else if (step === "4") {
            $(".step-container").css('min-height', '580px');
            traceResult.createCanvas();
            traceResult.clearCanvas();
            resultsVm.drawWalls();
        }
        _transitions(step);
    };
    var _loadPost = function (current) {
        if (_isPostLoaded === false) {
            current.load("/Templates/Post/post.html")
                .replace("#post-content")
                .load("/Templates/Post/post-preview.html")
                .replace("#post-preview")
                .load("/Templates/Post/plan-step1.html")
                .replace("#plan-step1")
                .load("/Templates/Post/plan-step2.html")
                .replace("#plan-step2")
                .load("/Templates/Post/plan-step3.html")
                .replace("#plan-step3")
                .load("/Templates/Post/plan-step4.html")
                .replace("#plan-step4")
                .then(function() {
                    tracer.createCanvas();
                    cks.viewMediators.post(postVm, map, geoLocation, tracer);
                    cks.transitions.post.init();
                });
            _isPostLoaded = true;
        }
        $("#content").hide();
        $("#post-content").show();
    };
    var _hasRunOnce = false;

    var _app = $.sammy('body', function() {

        this.debug = true;
        this.before({ except: { path: ["#!/login", "#!/register"] } }, function() {
            _renderLoginSection(this);
            loginVm.lastUrl("/" + window.location.hash);
            registerVm.lastUrl("/" + window.location.hash);
        });
        this.before({ only: { path: ["#!/post"] } }, function(context) {
            return true;
            if (_isAlreadySignedIn === true) {
                return true;
            } else if (loginVm.userIsSignedIn() === false || loginVm.userIsSignedIn() === undefined) {
                window.location.href = "/#!/login";
                return false;
            }
            return true;
        });
        this.before(/.*/, function (context) {
            if (_hasRunOnce === false) {
                cks.viewMediators.projectSelection(projectSelectionVm);
                $.pnotify.defaults.history = false;
                cks.transitions.hideProjectListWhenClickedOutside(projectSelectionVm);
                _hasRunOnce = true;
                var _setLocation = function () {
                    indexVm.located(geoLocation.isLocated());
                    indexVm.location(geoLocation.getCurrentAreaFormattedAddress());
                };
                if (geoLocation.isLocated() !== true) {
                    geoLocation.initialize(_setLocation);
                } else {
                    _setLocation();
                }
            }
            
            _gaq.push(['_trackPageview', context.path.replace("#!/", "")]);
        });
        this.before({ except: { path: /#!\/post.*/ } }, function (context) {
            $("#post-content").hide();
            $("#content").show();
        });
        this.get('#!/', function (context) {
            this.load("/Templates/home.html")
                .replace("#content")
                .then(function () { cks.viewMediators.index(indexVm); });
            cks.transitions.highlightMenu("HOME");
        });
        this.get('#!/login', function (context) {
            _isAlreadySignedIn = undefined;
            this.load("/Templates/Account/login.html")
                .replace("#content")
                .then(cks.transitions.signIn)
                .then(function () {
                    cks.viewMediators.login(loginVm);
                });
            cks.transitions.highlightMenu("");
        });
        this.get('#!/register', function (context) {
            _isAlreadySignedIn = undefined;
            this.load("/Templates/Account/register.html")
                .replace("#content")
                .then(cks.transitions.register)
                .then(function () { cks.viewMediators.register(registerVm); });
            cks.transitions.highlightMenu("");
        });       
        this.get('#!/faq', function (context) {
            this.load("/Templates/FAQ/FAQ.html")
                .replace("#content");
            cks.transitions.highlightMenu("FAQ");
        });        
        this.get('#!/about', function (context) {
            this.load("/Templates/About/About.html")
                .replace("#content");
            cks.transitions.highlightMenu("ABOUT");
        });
        this.get('#!/post', function (context) {
            context.redirect("#!/post/step1");
        });
        this.get('#!/post/debug/step:step', function (context) {
            var _populateStep2 = function () {
                postVm.wallsVm.heightInput.cm(200);
                postVm.traceEstimateVm.sampleFloorPlanClicked();
                postVm.traceEstimateVm.exteriorWallClicked();
                postVm.tracer.walls([{ "startPoint": { "x": 152, "y": 137 }, "endPoint": { "x": 527, "y": 137 }, "wallType": "Exterior" }, { "startPoint": { "x": 527, "y": 137 }, "endPoint": { "x": 527, "y": 459 }, "wallType": "Exterior" }, { "startPoint": { "x": 527, "y": 459 }, "endPoint": { "x": 412, "y": 459 }, "wallType": "Exterior" }, { "startPoint": { "x": 412, "y": 459 }, "endPoint": { "x": 412, "y": 310 }, "wallType": "Exterior" }, { "startPoint": { "x": 412, "y": 310 }, "endPoint": { "x": 376, "y": 310 }, "wallType": "Exterior" }, { "startPoint": { "x": 376, "y": 310 }, "endPoint": { "x": 376, "y": 330 }, "wallType": "Exterior" }, { "startPoint": { "x": 376, "y": 330 }, "endPoint": { "x": 151, "y": 330 }, "wallType": "Exterior" }, { "startPoint": { "x": 152, "y": 330 }, "endPoint": { "x": 152, "y": 142 }, "wallType": "Exterior" }, { "startPoint": { "x": 152, "y": 224 }, "endPoint": { "x": 377, "y": 224 }, "wallType": "Internal" }, { "startPoint": { "x": 376, "y": 224 }, "endPoint": { "x": 376, "y": 310 }, "wallType": "Internal" }, { "startPoint": { "x": 278, "y": 224 }, "endPoint": { "x": 278, "y": 326 }, "wallType": "Internal" }, { "startPoint": { "x": 299, "y": 330 }, "endPoint": { "x": 299, "y": 226 }, "wallType": "Internal" }]);
                postVm.traceEstimateVm.walls([{ "startPoint": { "x": 152, "y": 137 }, "endPoint": { "x": 527, "y": 137 }, "wallType": "Exterior" }, { "startPoint": { "x": 527, "y": 137 }, "endPoint": { "x": 527, "y": 459 }, "wallType": "Exterior" }, { "startPoint": { "x": 527, "y": 459 }, "endPoint": { "x": 412, "y": 459 }, "wallType": "Exterior" }, { "startPoint": { "x": 412, "y": 459 }, "endPoint": { "x": 412, "y": 310 }, "wallType": "Exterior" }, { "startPoint": { "x": 412, "y": 310 }, "endPoint": { "x": 376, "y": 310 }, "wallType": "Exterior" }, { "startPoint": { "x": 376, "y": 310 }, "endPoint": { "x": 376, "y": 330 }, "wallType": "Exterior" }, { "startPoint": { "x": 376, "y": 330 }, "endPoint": { "x": 151, "y": 330 }, "wallType": "Exterior" }, { "startPoint": { "x": 152, "y": 330 }, "endPoint": { "x": 152, "y": 142 }, "wallType": "Exterior" }, { "startPoint": { "x": 152, "y": 224 }, "endPoint": { "x": 377, "y": 224 }, "wallType": "Internal" }, { "startPoint": { "x": 376, "y": 224 }, "endPoint": { "x": 376, "y": 310 }, "wallType": "Internal" }, { "startPoint": { "x": 278, "y": 224 }, "endPoint": { "x": 278, "y": 326 }, "wallType": "Internal" }, { "startPoint": { "x": 299, "y": 330 }, "endPoint": { "x": 299, "y": 226 }, "wallType": "Internal" }]);
                postVm.wallsVm.firstWallLengthInput.cm(1232);
            };
            var _step = this.params["step"];
            if ($("#plan-view").length === 0) {
                _loadPost(this);
            }
            if (_step === "2") {
                setTimeout(function () {
                    _checkStep(context, _step, this);
                    _populateStep2();
                }, 1000);
            }
            else if (_step === "3") {
                setTimeout(function () {
                    _populateStep2();
                    _checkStep(context, _step, this);
                }, 2000);
            }
            else if (_step === "4") {
                setTimeout(function () {
                    _populateStep2();
                    _checkStep(context, _step, this);
                }, 2500);
            }
            setTimeout(function () {
                postVm.currentStep(_step);
                _transitions(_step);
            }, 3000);
            
        });
        this.get('#!/post/step:step', function (context) {
            var _step = this.params["step"];
            _checkStep(context, _step, this);
            postVm.currentStep(_step);
            cks.transitions.highlightMenu("PLAN");
        });

    });
    return {
        app: _app
    };
};