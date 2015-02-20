var cks = cks || {};
cks.map = function () {
    var _mapApp;
    var _markers = [];
    var _initialize = function (id, zoom, latitude, longitude, mapTypeId) {
        var _center = latitude && longitude ? new google.maps.LatLng(latitude, longitude) : new google.maps.LatLng(-36.8986655, 174.75141099999996);
        _mapApp = new google.maps.Map(document.getElementById(id || 'map'), {
            zoom: zoom || 15,
            center: _center,
            mapTypeId: mapTypeId || google.maps.MapTypeId.ROADMAP
        });
        $("#plan-step2").hide();
    };
    
    var _markerUrl = function (markerType) {
        if (markerType === "Buy")
            return '/images/markers/marker-b.png';
        if (markerType === "Sell")
            return '/images/markers/marker-s.png';
        if (markerType === "Free")
            return '/images/markers/marker-f.png';
        return;
    };

    var _addMarker = function (latitude, longitude, title, draggable, markerType) {
        if (latitude && longitude) {
            var _image = new google.maps.MarkerImage(_markerUrl(markerType),
              new google.maps.Size(20, 29),
              new google.maps.Point(0, 0),
              new google.maps.Point(10, 29)
            );

            var _shadow = new google.maps.MarkerImage(
              '/images/markers/shadow.png',
              new google.maps.Size(38, 29),
              new google.maps.Point(0, 0),
              new google.maps.Point(10, 29)
            );

            var _shape = {
                coord: [19, 0, 19, 1, 19, 2, 19, 3, 19, 4, 19, 5, 19, 6, 19, 7, 19, 8, 19, 9, 19, 10, 19, 11, 19, 12, 19, 13, 19, 14, 19, 15, 19, 16, 19, 17, 19, 18, 19, 19, 7, 20, 7, 21, 6, 22, 6, 23, 5, 24, 5, 25, 4, 26, 4, 26, 4, 25, 4, 24, 4, 23, 4, 22, 4, 21, 4, 20, 0, 19, 0, 18, 0, 17, 0, 16, 0, 15, 0, 14, 0, 13, 0, 12, 0, 11, 0, 10, 0, 9, 0, 8, 0, 7, 0, 6, 0, 5, 0, 4, 0, 3, 0, 2, 0, 1, 0, 0, 19, 0],
                type: 'poly'
            };

            var _marker = new google.maps.Marker({
                raiseOnDrag: false,
                icon: _image,
                shadow: _shadow,
                shape: _shape,
                position: new google.maps.LatLng(latitude, longitude),
                title: title,
                map: _mapApp,
                draggable: draggable || true
            });


            _markers.push(_marker);
            return _markers.length - 1;
        }
        return;
    };
    var _getMapApp = function () {
        return _mapApp;
    };

    return {
        initialize: _initialize,
        addMarker: _addMarker,
        markers: _markers,
        markerUrl: _markerUrl,
        get: _getMapApp
    };
};