requirejs.config({
    //By default load any module IDs from scripts/lib
    baseUrl: 'Scripts/lib',
    paths: {
        'jquery': '../../Scripts/Client/lib/jquery',
        'underscore': '../../Scripts/Client/lib/underscore',
        'backbone': '../../Scripts/Client/lib/backbone',
        'bootstrap': '../../Scripts/Client/lib/bootstrap',
        'App': '../../Scripts/Client/models/app',
        //'Router' : 'router',
        'Report': '../../Scripts/Client/models/report',
        'ReportCollection': '../../Scripts/Client/collections/reportCollection',
        'ReportView': '../../Scripts/Client/views/reportView',
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
        }
    }
});


require(['App', 'ReportCollection', 'Report'], function (App, ReportCollection, Report) {
    App.initialize();

    var Reports = new ReportCollection;

    Reports.fetch({
        success: function (model, response) {
            //console.log(Reports.toJSON());
            console.log("fetch - success", model, response);
        },
        error: function (model, response) {
            console.log("fetch - error", model, response);
        }
    });

    var a = new Report;
    a.set({"title":"YRA", "id":"8"});
    //console.log(a.toJSON());

    a.save({}, {
        success: function (model, response) {
            console.log("save - success", model, response);
        },
        error: function (model, response) {
            console.log("save - error", model, response);
        }
    });
    
  
    return Reports;
});