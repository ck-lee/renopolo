var cks = cks || {};
cks.entities = cks.entities || {};
cks.entities.walls = function (planningVm, traceEstimateVm, wallsVm, tracer) {
    var _toJs = function () {
        var _results = [];
        _.each(traceEstimateVm.calculatedWalls(), function (wall, index) {
            _results.push({
                startPointX: wall.points.startPoint.x,
                startPointY: wall.points.startPoint.y,
                endPointX: wall.points.endPoint.x,
                endPointY: wall.points.endPoint.y,
                length: wall.length.cm,
                height: wallsVm.heightInCm(),
                wallType: wall.wallType,
                id: wall.id,
                wallIndex: index
            });
        });
        return _results;
    };
    var _toVm = function (walls) {
        var _measurements = cks.measurements();
        if (!walls) {
            wallsVm.heightInput.cm(undefined);
            wallsVm.firstWallLengthInput.cm(undefined);
            tracer.points = [];
            tracer.walls([]);
            traceEstimateVm.walls([]);
            return;
        }
        _measurements.populateInputFromCm(wallsVm.heightInput, planningVm.unitsSystem(), walls[0].height);
        _measurements.populateInputFromCm(wallsVm.firstWallLengthInput, planningVm.unitsSystem(), walls[0].length);
        tracer.points = [];
        traceEstimateVm.walls([]);
        _.each(walls, function (wall, index) {
            if (index === 0) {
                tracer.points.push({ x: wall.startPointX, y: wall.startPointY });
            }
            tracer.walls().push({
                "startPoint": { x: wall.startPointX, y: wall.startPointY },
                "endPoint": { x: wall.endPointX, y: wall.endPointY },
                "wallType": wall.wallType
            });
            tracer.points.push({ x: wall.endPointX, y: wall.endPointY, id: wall.id });
            traceEstimateVm.walls().push(
                {
                    id: wall.id,
                    wallType: wall.wallType,
                    startPoint: {x: wall.startPointX, y: wall.startPointY},
                    endPoint: {x: wall.endPointX, y: wall.endPointY}
                }
            );
            traceEstimateVm.walls.valueHasMutated();
        });
        
        //traceEstimateVm.points(tracer.points);
    };
    return {
        toJs: _toJs,
        toVm: _toVm
    };
}