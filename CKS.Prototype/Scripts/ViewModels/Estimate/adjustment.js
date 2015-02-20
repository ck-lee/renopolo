var cks = cks || {};
cks.viewModels = cks.viewModels || {};
cks.viewModels.adjustment = function (planningVm, exteriorAdjustmentsSelection, interiorAdjustmentsSelection, editRowIsVisible) {
    var _measurements = cks.measurements();
    var _selectedType = ko.observable();
    var _count = ko.observable();
    var _sizeInput = ko.observable();
    _sizeInput.sqM = ko.observable();
    _sizeInput.sqFt = ko.observable();
    var _pseudoSize = ko.computed(function () {
        return cks.validations.computedFromInput(planningVm.unitsSystem(), _sizeInput.sqM(), _sizeInput.sqFt(), 0);
    });
    var _totalSizeInput = ko.observable();
    _totalSizeInput.sqM = ko.observable();
    _totalSizeInput.sqFt = ko.observable();

    var _calculateTotalSize = function (count, size) {
        var _result = count * size;
        return _measurements.tryToFixed2Decimal(_result);
    };

    _sizeInput.sqM.subscribe(function (newValue) {
        if (isNaN(newValue) || isNaN(_count()))
            return;
        var _totalSize = _calculateTotalSize(_count(), newValue);
        _totalSizeInput.sqM(_totalSize);
    });
    
    _sizeInput.sqFt.subscribe(function (newValue) {
        if (isNaN(newValue) || isNaN(_count()))
            return;
        var _totalSize = _calculateTotalSize(_count(), newValue);
        _totalSizeInput.sqFt(_totalSize);
    });

    _count.subscribe(function (newValue) {
        if (isNaN(newValue))
            return;
        if (isNaN(_sizeInput.sqM()) && isNaN(_sizeInput.sqFt()))
            return;        
        _totalSizeInput.sqM(_calculateTotalSize(newValue, _sizeInput.sqM()));
        _totalSizeInput.sqFt(_calculateTotalSize(newValue, _sizeInput.sqFt()));
    });

    var _pseudoTotalSize = ko.computed(function () {
        return cks.validations.computedFromInput(planningVm.unitsSystem(), _totalSizeInput.sqM(), _totalSizeInput.sqFt(), 0);
    });
    var _editRowIsVisible = ko.observable(editRowIsVisible || false);
    var _viewRowClicked = function () {
        _editRowIsVisible(true);
    };

    var _editCancelClicked = function () {
        _editRowIsVisible(false);
    };

    var _selectedTypeText = ko.computed(function () {
        var _adjustmentSelection = exteriorAdjustmentsSelection().concat(interiorAdjustmentsSelection());
        var _selectedAdjustment = _.find(_adjustmentSelection, function (adjustment) {
            return adjustment.value === _selectedType();
        });
        if (_selectedAdjustment)
            return _selectedAdjustment.text;
        return;
    });
    
    var _sizeInSqM = ko.computed(function () {
        return _measurements.calculateAreaInSqMFromInputs(planningVm.unitsSystem(), _sizeInput.sqM(), _sizeInput.sqFt());
    });
    
    var _totalSizeInSqM = ko.computed(function () {
        return _measurements.calculateAreaInSqMFromInputs(planningVm.unitsSystem(), _totalSizeInput.sqM(), _totalSizeInput.sqFt());
    });
    
    var _getAreaDisplay = function (area) {
        var _displayText = _measurements.getAreaInDisplay(area, planningVm.unitsSystem(), true);
        return _displayText;
    };

    var _totalSizeInputSqMIsFocused = ko.observable();
    var _totalSizeInputSqFtIsFocused = ko.observable();

    var _totalSizeInputIsFocused = ko.computed(function () {
        return _totalSizeInputSqFtIsFocused() || _totalSizeInputSqMIsFocused();
    });

    var _calculatedInputClicked = function () {
        _count.valueHasMutated();
    };

    var _totalIsCalculated = ko.computed(function () {
        var _total = _calculateTotalSize(_count(), _sizeInSqM());
        if (planningVm.unitsSystem() === "Imperial") {
            if (!_total || !_totalSizeInSqM())
                return;
            return Math.round(_measurements.convertSqMToSqFt(_total)) == Math.round(_measurements.convertSqMToSqFt(_totalSizeInSqM()));
        } else {
            if (!_total || !_totalSizeInSqM())
                return;
            return _total == _totalSizeInSqM();
        }
    });

    var _id = ko.observable();

    var _setProperties = function (selectedType, count, sizeSqM, sizeSqFt, totalSizeSqM, totalSizeSqFt) {
        _selectedType(selectedType);
        _count(count);
        _sizeInput.sqM(sizeSqM);
        _sizeInput.sqFt(sizeSqFt);
        _totalSizeInput.sqM(totalSizeSqM);
        _totalSizeInput.sqFt(totalSizeSqFt);
    };

    return {
        selectedType: _selectedType,
        count: _count,
        sizeInput: _sizeInput,
        pseudoSize: _pseudoSize,
        totalSizeInput: _totalSizeInput,
        pseudoTotalSize: _pseudoTotalSize,
        planningVm: planningVm,
        viewRowClicked: _viewRowClicked,
        editRowIsVisible: _editRowIsVisible,
        editCancelClicked: _editCancelClicked,
        selectedTypeText: _selectedTypeText,
        getAreaDisplay: _getAreaDisplay,
        sizeInSqM: _sizeInSqM,
        totalSizeInSqM: _totalSizeInSqM,
        totalSizeInputIsFocused: _totalSizeInputIsFocused,
        totalSizeInputSqMIsFocused: _totalSizeInputSqMIsFocused,
        totalSizeInputSqFtIsFocused: _totalSizeInputSqFtIsFocused,
        calculatedInputClicked: _calculatedInputClicked,
        totalIsCalculated: _totalIsCalculated,
        setProperties: _setProperties,
        id: _id
    };
}