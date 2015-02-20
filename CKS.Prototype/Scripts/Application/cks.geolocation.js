var cks = cks || {};
cks.geoLocation = function () {
    var _geocoder;
    var _results;
    var _located;
    var _callback;
    
    var _setUnknownLocation = function () {
        _located = false;
    };

    var _codeLatLng = function (lat, lng) {
        var _latlng = new google.maps.LatLng(lat, lng);
        _geocoder.geocode({ 'latLng': _latlng }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                _results = results;
                _located = true;
                if (_callback) {
                    _callback();
                }
            } else {
                _setUnknownLocation();
            }
        });
    };

    //Get the latitude and the longitude;
    var _successFunction = function (position) {
        var _lat = position.coords.latitude;
        var _lng = position.coords.longitude;
        _codeLatLng(_lat, _lng);
    };
    
    var _errorFunction = function () {
        _setUnknownLocation();
    };
  
    var _initialize = function (callback) {
        _setUnknownLocation();
        _callback = callback;
        //***Remove GeoLocation
        //_geocoder = new google.maps.Geocoder();
        //if (navigator.geolocation) {
        //    navigator.geolocation.getCurrentPosition(_successFunction, _errorFunction);
        //}
    };

    var _getCurrentAreaFormattedAddress = function () {
        var _result = _getResultByType(_results, "sublocality") || _getResultByType(_results, "locality") || _getResultByType(_results, "country");
        if (_result) {
            _located = true;
            return _result.formatted_address;
        } else {
            _setUnknownLocation();
            return "Unknown location";
        }
    };
    
    var _getCurrentCoordinates = function () {
        return _results[0].geometry.location;
    };

    var _isLocated = function () {
        return _located;
    };

    var _getAddressComponent = function (result, addressComponent) {
        return _.find(result.address_components,
            function (obj) {
                return _.contains(obj.types, addressComponent);
            });
    };

    var _getCurrentCountry = function () {
        //***Remove GeoLocation
        return null;
        var _result = _getResultByType(_results, "country");
        if (_result) {
            return _result.formatted_address;
        } else {
            return null;
        }
    };

    var _getResultByType = function (results, type) {
        return _.find(results,
            function (obj) {
                return _.contains(obj.types, type);
            });
    };

    return {
        initialize: _initialize,
        isLocated: _isLocated,
        getCurrentAreaFormattedAddress: _getCurrentAreaFormattedAddress,
        getCurrentCoordinates: _getCurrentCoordinates,
        getAddressComponent: _getAddressComponent,
        getCurrentCountry: _getCurrentCountry
    };
};