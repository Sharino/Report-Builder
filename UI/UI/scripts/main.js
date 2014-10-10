requirejs.config({
    //By default load any module IDs from scripts/lib
    baseUrl: '',
    paths: {
        /* External dependencies */
        'jquery':               'scripts/lib/jquery',
        'underscore':           'scripts/lib/underscore',
        'backbone':             'scripts/lib/backbone',
        'handlebars':           'scripts/lib/handlebars',
        'bootstrap':            'scripts/lib/bootstrap',
        'text':                 'scripts/lib/text',
        'Sortable':             'scripts/lib/jquery.sortable',
        'Tests':                'tests',

        /* Adform dependencies */
        'adform-checkbox':      'scripts/lib/adform-checkbox',
        'adform-select':        'scripts/lib/adform-select',
        'adform-notifications': 'scripts/lib/adform-notifications',

        /* Config dependencies */
        'Config':               'scripts/config/config',

        /* Model dependencies */
        'App':                  'scripts/models/app',
        'Component':            'scripts/models/component',
        'Metric':               'scripts/models/metric',

        /* Collection dependencies */
        'ComponentCollection':  'scripts/collections/componentCollection',
        'MetricCollection':     'scripts/collections/metricCollection',


        /* View dependencies */
        'ComponentView':        'scripts/views/componentView',
        'ComponentListView':    'scripts/views/componentListView',
        'MenuView':             'scripts/views/menuView',
        'MetricView':           'scripts/views/metricView',
        'MetricListView':       'scripts/views/metricListView',

        /* Router dependencies */
        'Router':               'scripts/routers/router'
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'backbone'
        },
        'underscore': {
            exports: '_'
        },
        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        'jquery-sortable': {
            deps: ['jquery']
        },
        'handlebars': {
            exports: 'Handlebars'
        },
        'backbone-forms': {
            deps: ['backbone', 'jquery']
        }
    },
    urlArgs: "bust=" + (new Date()).getTime()

});


require(['Component', 'ComponentCollection', 'ComponentView', 'ComponentListView', 'MenuView', 'Router', 'Config'],
    function (Component, ComponentCollection, ComponentView, ComponentListView, MenuView, Router, Config) {
        console.log(Config);

        Backbone.View.prototype.close = function () {
            console.log('Closing view', this);
            if (this.beforeClose) {
                this.beforeClose();
            }
            this.remove();
            this.unbind();

            //console.log("this.childViews", this.childViews);
            _.each(this.childViews, function (childView) {
                if (childView.close) {
                    childView.close();
                }
            });
            this.childViews = [];
        };

        var app = new Router();
        app.initialize();
        Backbone.history.start();
});