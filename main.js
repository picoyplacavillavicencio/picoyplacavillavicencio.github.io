require([
    "esri/Map",
    "esri/views/MapView",
    "esri/WebMap",
    "esri/geometry/Point",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "esri/widgets/Home",
    "esri/widgets/Locate",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/symbols/PictureMarkerSymbol",
    "esri/widgets/Legend",
    "esri/renderers/SimpleRenderer"
], function(Map, MapView, WebMap, Point, QueryTask, Query, Home, Locate, Graphic, GraphicsLayer, PictureMarkerSymbol, Legend, SimpleRenderer) {
    var webmap = new WebMap({
        portalItem: {
            id: "dbce66d3fd6c41bd85394c9113c52a45"
        }
    });

    var view = new MapView({
        container: "viewDiv",
        map: webmap
    });

    var symbol = new PictureMarkerSymbol({
        url: "https://raw.githubusercontent.com/picoyplacavillavicencio/picoyplacavillavicencio.github.io/e11c64a214d977a03a9b8a997b43d8bc9cbd098a/car.png",
        width: "64px",
        height: "64px"
    });

    var renderer = new SimpleRenderer({
        symbol: symbol,
        label: "Car",
        description: "This is a car"
    });
    
    var graphicsLayer = new GraphicsLayer({
        renderer: renderer
    });

    webmap.add(graphicsLayer);

    view.when(function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            var point = new Point({
                longitude: position.coords.longitude,
                latitude: position.coords.latitude
            });

            var pointGraphic = new Graphic({
                geometry: point,
                symbol: symbol
            });

            graphicsLayer.add(pointGraphic);

            var queryTask = new QueryTask({
                url: "https://services1.arcgis.com/7S16A7PAFcmSmqJA/arcgis/rest/services/Zona_pyp/FeatureServer/0"
            });

            var query = new Query();
            query.geometry = point;
            query.spatialRelationship = "intersects";

            queryTask.execute(query).then(function(result) {
                if (result.features.length > 0) {
                    alert("Usted está en zona de pico y placa");
                } else {
                    alert("Usted no está en zona de pico y placa");
                }
            });

        });
    });

    var legend = new Legend({
        view: view
    });

    var homeWidget = new Home({
        view: view
    });

    var locateWidget = new Locate({
        view: view,
        useHeadingEnabled: false,
        goToOverride: function(view, options) {
            options.target.scale = 1500;
            return view.goTo(options.target);
        }
    });
    view.ui.add(legend, "bottom-right");
    view.ui.add(homeWidget, "top-left");
    view.ui.add(locateWidget, "top-left");
    locateWidget.locate();

});