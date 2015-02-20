var cks = cks || {};
cks.viewModels = cks.viewModels || {};
cks.viewModels.projectSelection = function (planningVm, loginVm, projectEntity, traceEstimateVm) {
    var _userIsSignedIn = loginVm.userIsSignedIn;
    var _sectionIsVisible = ko.computed(function () {
        if (!_userIsSignedIn() && !planningVm.title())
            return false;
        return true;
    });
    var _projectListIsVisible = ko.observable(false);
    var _titleDisplay = ko.computed(function () {
        if (!planningVm.title()) {
            return "* New plan";
        }
        return "Plan: " + planningVm.title();
    });
    var _sectionDisplay = ko.computed(function () {
        if (loginVm.userIsSignedIn() === false) {
            return "Sign in to save this plan";
        }
        else if (!planningVm.title())
            return "Click here to load a saved plan";
        return "";
    });

    var _showProjectList = function () {
        _projectListIsVisible(true);
    };
    
    var _hideProjectList = function () {
        _projectListIsVisible(false);
    };

    var _projectSelectionClicked = function () {
        _projectListIsVisible(!_projectListIsVisible());      
    };
    
    var _projectList = ko.observableArray();

    var _getProjectsService = function() {
        var _service = cks.services.ajax({
            url: "/api/plan/Projects/",
            type: "get"
        });
        _service.success(function (response) {
            _.each(response, function (project, index) {
                var _projectIsSelected = function () {
                    projectEntity.toVm(response[index]);
                    _projectListIsVisible(false);
                    app.postVm.redrawFloorPlan();
                };
                _.extend(project, { projectIsSelected: _projectIsSelected });
                var _walls = project.sections[0].walls;
                var _exteriorWallCount = _.countBy(_walls, function (wall) {
                    return wall.wallType === "Exterior";
                }).true || 0;
                var _internalWallCount = _.countBy(_walls, function (wall) {
                    return wall.wallType === "Internal";
                }).true || 0;
                _.extend(project, { subDisplay: "Walls: Exterior(" + _exteriorWallCount + ") Internal(" + _internalWallCount + ")" });
            });
            _projectList(response);            
        }).error(function (response) {
            $.pnotify({
                title: 'Oops',
                text: "We can't seem to sign you in right now. Try again later.",
                type: 'error'
            });

        });
        return _service;
    };

    
    _userIsSignedIn.subscribe(function (newValue) {
        if (newValue === true) {
            _getProjectsService().success(function (response) {
                if (response.length > 0) {
                    projectEntity.toVm(response[0]);
                    app.postVm.redrawFloorPlan();
                }
            });
        } else {
            _projectListIsVisible(false);
            _projectList.destroyAll();
            if (planningVm.title()) {
                $.pnotify({
                    title: 'Project is not saved.',
                    text: "Please sign in to save your plan",
                    type: 'alert'
                });
            }
        }
    });

    var _startNewPlanIsClicked = function () {
        projectEntity.toVm(undefined);
        planningVm.metricClicked();
        _projectListIsVisible(false);
        traceEstimateVm.tracerSectionIsVisible(false);
        window.location.href = "/#!/post/step1";
    };

    return {
        titleDisplay: _titleDisplay,
        sectionDisplay: _sectionDisplay,
        userIsSignedIn: _userIsSignedIn,
        sectionIsVisible: _sectionIsVisible,
        projectListIsVisible: _projectListIsVisible,
        projectSelectionClicked: _projectSelectionClicked,
        projectList: _projectList,
        showProjectList: _showProjectList,
        hideProjectList: _hideProjectList,
        startNewPlanIsClicked: _startNewPlanIsClicked,
        getProjectsService: _getProjectsService
    };
};