requirejs.config({
    //By default load any module IDs from scripts/lib
    baseUrl: 'Scripts/lib',
    paths: {
        'jquery' : 'lib/jquery',
        'underscore' : 'lib/underscore',
        'backbone' : 'lib/backbone',
        'bootstrap' : 'lib/bootstrap',
        'App' : 'app',
        //'Router' : 'router',
        'ReportModel' : 'models/report',
        'ReportCollection' : 'collections/reportCollection',
        'ReportView' : 'views/reportView',
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


require(['App'], function (App, Client) {
    App.initialize();


    var Reports = new ReportCollection;

    Reports.fetch({
        success: function () {
            console.log(Reports.toJSON());
        }
    });
    return Reports;
});