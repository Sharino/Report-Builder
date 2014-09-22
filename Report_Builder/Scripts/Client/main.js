requirejs.config({
    //By default load any module IDs from scripts/lib
    baseUrl: 'Scripts/lib',
    paths: {
        'jquery': '../../Scripts/Client/lib/jquery',
        'underscore': '../../Scripts/Client/lib/underscore',
        'backbone': '../../Scripts/Client/lib/backbone',
        'bootstrap': '../../Scripts/Client/lib/bootstrap',
        'App': '../../Scripts/Client/app',
        //'Router' : 'router',
        'ReportModel': '../../Scripts/Client/models/report',
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


require(['App', 'ReportCollection'], function (App, ReportCollection) {
    App.initialize();

    console.log("lol");

    var Reports = new ReportCollection;

    Reports.fetch({
        success: function () {
            console.log(Reports.toJSON());
        }
    });
    return Reports;
});