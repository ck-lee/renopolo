(function ($) {
    ko.bindingHandlers['jqueryui'] = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var getWidgetBindings = function (element, valueAccessor, allBindingsAccessor) {
                // Extract widgetName and widgetOptions from the data binding,
                // with some sanity checking and error reporting.
                // Returns dict: widgetName, widgetOptions.

                var _value = valueAccessor(),
                    _myBinding = ko.utils.unwrapObservable(_value),
                    _allBindings = allBindingsAccessor();

                if (typeof (_myBinding) === 'string') {
                    // Short-form data-bind='jqueryui: "widget_name"'
                    // with no additional options
                    _myBinding = { 'widget': _myBinding };
                }

                var _widgetName = _myBinding.widget,
                    _widgetOptions = _myBinding.options; // ok if undefined

                // Sanity check: can't directly check that it's truly a _widget_, but
                // can at least verify that it's a defined function on jQuery:
                if (typeof $.fn[_widgetName] !== 'function') {
                    throw new Error("jqueryui binding doesn't recognize '" + _widgetName + "' as jQuery UI widget");
                }

                // Sanity check: don't confuse KO's 'options' binding with jqueryui binding's 'options' property
                if (_allBindings.options && !_widgetOptions && element.tagName !== 'SELECT') {
                    throw new Error("jqueryui binding options should be specified like this:\n" + "  data-bind='jqueryui: {widget:\"" + _widgetName + "\", options:{...} }'");
                }

                //Auto-show all options if widget is AutoComplete and minLength is set to zero
                if (_widgetName == "autocomplete" && _widgetOptions.minLength == 0) {
                    $(element).focus(function () {
                        $(element).autocomplete("search", "");
                    });
                }

                return {
                    widgetName: _widgetName,
                    widgetOptions: _widgetOptions
                };
            };

            var _widgetBindings = getWidgetBindings(element, valueAccessor, allBindingsAccessor);

            // Attach the jQuery UI Widget and/or update its options.
            // (The syntax is the same for both.)
            $(element)[_widgetBindings.widgetName](_widgetBindings.widgetOptions);
        }
    };
    
    ko.bindingHandlers.fadeVisible = {
        init: function (element, valueAccessor) {
            // Initially set the element to be instantly visible/hidden depending on the value
            var _value = valueAccessor();
            $(element).toggle(ko.utils.unwrapObservable(_value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
        },
        update: function (element, valueAccessor) {
            // Whenever the value subsequently changes, slowly fade the element in or out
            var _value = valueAccessor();
            ko.utils.unwrapObservable(_value) ? $(element).fadeIn() : $(element).fadeOut();
        }
    };

    ko.bindingHandlers.slideVisible = {
        update: function (element, valueAccessor, allBindingsAccessor) {
            // First get the latest data that we're bound to
            var _value = valueAccessor(), _allBindings = allBindingsAccessor();

            // Next, whether or not the supplied model property is observable, get its current value
            var _valueUnwrapped = ko.utils.unwrapObservable(_value);

            // Grab some more data from another binding property
            var _duration = _allBindings.slideDuration || 400; // 400ms is default duration unless otherwise specified

            // Now manipulate the DOM element
            if (_valueUnwrapped == true)
                $(element).slideDown(_duration); // Make the element visible
            else
                $(element).slideUp(_duration);   // Make the element invisible
        }
    };

    //dirty flag
    ko.extenders.dirtyFlag = function (target) {
        var _firstLoad = true;
        var _result = ko.computed({
            read: target,  //always return the original observables value
            write: function (newValue) {
                if (_firstLoad) {
                    target(newValue);
                    _firstLoad = false;
                } else {
                    var _current = target();
                    //only write if it changed
                    if (newValue !== _current) {
                        target(newValue);
                        _result.isDirty(true);
                    } else {
                        _result.isDirty(false);
                    }
                }
            }
        });
        _result.isDirty = ko.observable(false);

        _result(target());

        //return the new computed observable
        return _result;
    };

    ko.extenders.validations = function (target, parameters) {
        //add some sub-observables to our observable
        target.isValid = ko.observable(true);
        target.validationMessage = ko.observable();
        target.isTriggered = ko.observable(false);
        target.isTriggeredBefore = ko.observable(false);
        var _firstLoad = true;

        var _rules = parameters.rules;
        //loop to check each validation, return if first error is found
        var _checkValidations = function (newValue) {
            var _anyError = false;
            _.each(_rules, function (rule) {
                if (!rule)
                    return;
                if ((rule.triggerOnly && target.isTriggered()) || (rule.triggerMultiple && target.isTriggeredBefore()) || (!rule.triggerOnly && !rule.triggerMultiple)) {
                    if (rule.validationFunction(newValue) === false) {
                        target.isValid(false);
                        target.validationMessage(ko.utils.unwrapObservable(rule.errorMessage) || "Please check this field for error");
                        _anyError = true;
                        return false;
                    }
                }
                    //check trigger only validation anyway to block the rest of validation running if true.
                else if ((rule.triggerOnly && !target.isTriggered()) || rule.triggerMultiple && !target.isTriggered() || target.isTriggered() === undefined) {
                    if (rule.validationFunction(newValue) === false) {
                        _anyError = true;
                        return false;
                    }
                }
            });
            return _anyError;
        };

        //define a function to do validation
        var _validate = function (newValue) {
            if (_firstLoad) {
                _firstLoad = false;
                return;
            }
            var _before = target.validationMessage();
            if (!_checkValidations(newValue)) {
                target.isValid(true);
                target.validationMessage("");
            }
            //notify dependent observables if validations has changed.
            if (_before != target.validationMessage()) {
                if (parameters.dependencies) {
                    $.each(parameters.dependencies, function (index, dependency) {
                        //trigger to run
                        dependency.isTriggered(undefined);
                    });
                }
            }

        };

        //initial validation
        _validate(target());

        //validate whenever the value changes
        target.subscribe(_validate);

        //validate onlyTrigger Validations
        target.isTriggered.subscribe(function () {
            if (target.isTriggered() && !target.isTriggeredBefore())
                target.isTriggeredBefore(true);

            if (target.isTriggered() || target.isTriggered() === undefined)
                _validate(target());

            target.isTriggered(false);
        });

        target.validate = function () {
            return _checkValidations(target());
        };

        if (parameters.watch) {
            parameters.watch.push(target);
        }

        //return the original observable
        return target;
    };
    
    ko.subscribable.fn.money = function (prefix, showCents) {
        var _target = this;

        var _format = function (value, _prefix) {
            if (!value || value === "" || isNaN(value))
                return undefined;
            var _toks = value.toFixed(2).replace('-', '').split('.');
            var _display = _prefix + $.map(_toks[0].split('').reverse(), function (elm, i) {
                return [(i % 3 === 0 && i > 0 ? ',' : ''), elm];
            }).reverse().join('');

            if (showCents)
                _display = _display + '.' + _toks[1];
            return value < 0 ? '(' + _display + ')' : _display;
        };

        var _parseFloatWithComma = function (input) {
            // remove commas
            var _replacedInput = new String(input).replace(/\,/g, '');
            return parseFloat(_replacedInput);
        };

        // the default value for prefix is a dollar sign
        if (typeof prefix === 'undefined' || prefix === null)
            prefix = "$";

        var _writeTarget = function (value) {
            if (!value || value === "" || isNaN(value))
                _target(value);
            else
                _target(_parseFloatWithComma(value));
        };

        var _result = ko.computed({
            read: function () {
                return _target();
            },
            write: _writeTarget
        });

        _result.formatted = ko.computed({
            read: function () {
                return _format(_target(), prefix);
            },
            write: _writeTarget
        });

        return _result;
    };
    
    ko.bindingHandlers.map = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var _options = valueAccessor() || {};
            var _currentXCoordinate;
            var _currentYCoordinate;
            var _initializeMap = function () {
                _currentXCoordinate = _.values(_options.geoLocation.getCurrentCoordinates())[0];
                _currentYCoordinate = _.values(_options.geoLocation.getCurrentCoordinates())[1];
                _options.map.initialize(element.id,
                                        _options.zoom,
                                        _currentXCoordinate,
                                        _currentYCoordinate);
                var _markerIndex = _options.map.addMarker(_currentXCoordinate, _currentYCoordinate, _options.title(), false, _options.action());
                viewModel.__markerIndex = _markerIndex;
                _options.latitude.subscribe(function (newValue) {
                    var _latlng = new google.maps.LatLng(newValue, _options.longitude());
                    _options.map.markers[_markerIndex].setPosition(_latlng);
                });
                _options.longitude.subscribe(function (newValue) {
                    var _latlng = new google.maps.LatLng(_options.latitude(), newValue);
                    _options.map.markers[_markerIndex].setPosition(_latlng);
                });
                _options.action.subscribe(function (newValue) {
                    var _image = new google.maps.MarkerImage(app.map.markerUrl(newValue),
                      new google.maps.Size(20, 29),
                      new google.maps.Point(0, 0),
                      new google.maps.Point(10, 29)
                    );
                    _options.map.markers[_markerIndex].setIcon(_image);
                });
                _options.latitude(_currentXCoordinate);
                _options.longitude(_currentYCoordinate);
                
            };
            if (_options.geoLocation.isLocated() !== true) {
                _options.geoLocation.initialize(_initializeMap);
            } else {
                _initializeMap(new google.maps.LatLng(_currentXCoordinate, _currentYCoordinate));
            }
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var _options = valueAccessor() || {};
            if (viewModel.__mapMarker) {
                var _latlng = new google.maps.LatLng(_options.latitude(), _options.longitude());
                viewModel.__mapMarker.setPosition(_latlng);
            }
        }
    };

    ko.bindingHandlers.measurement = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var _options = valueAccessor() || {};
            var _allBindings = allBindingsAccessor();
            var _buildElements = function (elements, selectedUnitSystem) {
                _.each(elements, function (elem) {
                    var _koBind = "";
                    if (elem.koBind)
                        _koBind = ", " + elem.koBind;
                    var _$input = $("<input/>", { 
                        "type": "text",
                        "data-bind": "visible: " + _options.unitsSystem + "()===\"" + selectedUnitSystem + "\" , value:" + elem.subObservable + _koBind,
                        "class": "width-60px"
                    });
                    $(element).append(_$input);
                    $(element).append("<span class='unit' data-bind='visible: " + _options.unitsSystem + "()===\"" + selectedUnitSystem + "\"'>" + elem.label + "</span>");
                });
            };
            _buildElements(_options.metric, "Metric");
            _buildElements(_options.imperial, "Imperial");
            
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            
        }
    };
    
    ko.bindingHandlers.measurementMobile = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var _options = valueAccessor() || {};
            var _allBindings = allBindingsAccessor();
            var _buildElements = function (elements, selectedUnitSystem) {
                _.each(elements, function (elem) {
                    var _koBind = "";
                    if (elem.koBind)
                        _koBind = ", " + elem.koBind;
                    var _$fieldcontainer = $("<div />", {
                        "data-role": "fieldcontain"
                    });
                    var _$input = $("<input/>", {
                        "type": "text",
                        "name": elem.subObservable,
                        "id": elem.subObservable,
                        "data-bind": "visible: " + _options.unitsSystem + "()===\"" + selectedUnitSystem + "\" , value:" + elem.subObservable + _koBind
                    });
                    var _$label = $("<label/>", {
                        "data-bind": "visible: " + _options.unitsSystem + "()===\"" + selectedUnitSystem + "\"",
                        "for": elem.subObservable
                    }).text(" " + elem.label);
                    $(_$fieldcontainer).append(_$input);
                    $(_$fieldcontainer).append(_$label);
                    $(element).append(_$fieldcontainer);
                });
            };
            _buildElements(_options.metric, "Metric");
            _buildElements(_options.imperial, "Imperial");

        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {

        }
    };
    
    ko.bindingHandlers.select2 = {
        init: function (element, valueAccessor) {
            $(element).select2(valueAccessor());

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).select2('destroy');
            });
        },
        update: function (element) {
            $(element).trigger('change');
        }
    };

})(jQuery);
