var cks = cks || {};
cks.application = function (mobile) {
    var _indexVm = cks.viewModels.index();
    var _loginVm = cks.viewModels.login();
    var _userHeaderVm = cks.viewModels.userHeader(_loginVm);
    var _registerVm = cks.viewModels.register(_loginVm);
    var _tracer = cks.tracer();
    var _traceResult = cks.traceResult();
    var _geoLocation = cks.geoLocation();
    var _planningVm = cks.viewModels.planning();
    var _wallsVm = cks.viewModels.walls(_planningVm, _tracer);
    var _traceEstimateVm = cks.viewModels.traceEstimate(_tracer, _planningVm, _wallsVm);   
    var _wallsEntity = cks.entities.walls(_planningVm, _traceEstimateVm, _wallsVm, _tracer);
    var _adjustmentsEntity = cks.entities.adjustments(_planningVm, _traceEstimateVm, _wallsVm, _tracer);
    var _sectionsEntity = cks.entities.sections(_planningVm, _traceEstimateVm, _wallsVm, _wallsEntity, _adjustmentsEntity);
    var _projectEntity = cks.entities.project(_planningVm, _traceEstimateVm, _wallsVm, _sectionsEntity);
    var _projectSelectionVm = cks.viewModels.projectSelection(_planningVm, _loginVm, _projectEntity, _traceEstimateVm);   
    var _resultsVm = cks.viewModels.results(_projectEntity, _planningVm, _projectSelectionVm, _traceEstimateVm, _traceResult);
    var _postVm = cks.viewModels.post(_planningVm, _traceEstimateVm, _wallsVm, _projectEntity, _loginVm, _tracer, _geoLocation, _resultsVm);
    var _map = cks.map();
    if (mobile === true) {
        var _routerApp = cks.routerMobile(_geoLocation, _map, _indexVm, _loginVm, _userHeaderVm, _registerVm, _postVm, _projectSelectionVm, _resultsVm, _tracer).app;
        _routerApp.run('#!/');
    } else {
        var _routerApp = cks.router(_geoLocation, _map, _indexVm, _loginVm, _userHeaderVm, _registerVm, _postVm, _projectSelectionVm, _resultsVm, _tracer, _traceResult).app;
        _routerApp.run('#!/');
    }
    return {
        indexVm: _indexVm,
        loginVm: _loginVm,
        userHeaderVm: _userHeaderVm,
        registerVm: _registerVm,
        postVm: _postVm,
        routerApp: _routerApp,
        geoLocation: _geoLocation,
        map: _map,
        tracer: _tracer,
        planningVm: _planningVm,
        wallsVm: _wallsVm,
        traceEstimateVm: _traceEstimateVm,
        projectSelectionVm: _projectSelectionVm,
        resultsVm: _resultsVm,
        traceResult: _traceResult,
        entities: {
            project: _projectEntity,
            sections: _sectionsEntity,
            walls: _wallsEntity
        }
    };
};