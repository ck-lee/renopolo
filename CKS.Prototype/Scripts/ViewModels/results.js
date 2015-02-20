var cks = cks || {};
cks.viewModels = cks.viewModels || {};
cks.viewModels.results = function (projectEntity, planningVm, projectSelectionVm, traceEstimateVm, traceResult) {
    var _observablesWithValidation = ko.observableArray();
    var _isLoading = ko.observable(false);
    var _savePlanName = ko.computed(function () {
        return planningVm.title();
    });
    var _checkAllFieldsAreValid = function () {
        return cks.validations.checkFieldsAreValid(_observablesWithValidation);
    };

    var _drawWalls = function () {
        var _firstWall = _.first(traceEstimateVm.calculatedWalls());
        var _lastWall = _.last(traceEstimateVm.calculatedWalls());
        var _rightSideUp;
        if (_firstWall.points.startPoint.y - _firstWall.points.endPoint.y < -10) {
            if (_firstWall.points.startPoint.x - _lastWall.points.startPoint.x < -10) {
                _rightSideUp = false;
            }else if (_firstWall.points.startPoint.x - _lastWall.points.startPoint.x > 10) {
                _rightSideUp = true;
            }            
        } else if (_firstWall.points.startPoint.y - _firstWall.points.endPoint.y > 10) {
            if (_firstWall.points.startPoint.x - _lastWall.points.startPoint.x < -10) {
                _rightSideUp = true;
            }else if (_firstWall.points.startPoint.x - _lastWall.points.startPoint.x > 10) {
                _rightSideUp = false;
            }            
        } else if (_firstWall.points.startPoint.x - _firstWall.points.endPoint.x < -10) {
            if (_firstWall.points.startPoint.y - _lastWall.points.startPoint.y < -10) {
                _rightSideUp = true;
            }else if (_firstWall.points.startPoint.y - _lastWall.points.startPoint.y > 10) {
                _rightSideUp = false;
            }            
        } else if (_firstWall.points.startPoint.x - _firstWall.points.endPoint.x > 10) {
            if (_firstWall.points.startPoint.y - _lastWall.points.startPoint.y < -10) {
                _rightSideUp = false;
            }else if (_firstWall.points.startPoint.y - _lastWall.points.startPoint.y > 10) {
                _rightSideUp = true;
            }            
        }
        _.each(traceEstimateVm.calculatedWalls(), function(wall) {
            traceResult.drawWall(wall, _rightSideUp);
        });
    };

    var _saveClicked = function () {
        if (_checkAllFieldsAreValid() === false) {
            return;
        }
        _isLoading(true);
        var _projectJs = projectEntity.toJs();
        var _service = cks.services.ajax({
            url: "/api/plan/project/",
            type: "put",
            data: { project: _projectJs }
        });
        _service.error(function () {
            $.pnotify({
                title: 'Oops',
                text: 'Your changes might not be saved.',
                type: 'error'
            });
            _isLoading(false);
        }).success(function (response) {
            $.pnotify({
                title: _projectJs.title,
                text: 'Your plan is saved',
                type: 'success'
            });
            projectSelectionVm.getProjectsService();
            _isLoading(false);
        });
    };
    

    
    _savePlanName.extend({
        validations: {
            rules: [{ validationFunction: cks.validations.requiredField, errorMessage: "Please enter name.", triggerOnly: true }],
            watch: _observablesWithValidation
        }
    });

    return {
        saveClicked: _saveClicked,
        savePlanName: _savePlanName,
        isLoading: _isLoading,
        drawWalls: _drawWalls
    };
};