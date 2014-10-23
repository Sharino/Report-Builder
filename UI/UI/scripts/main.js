requirejs.config({
    //By default load any module IDs from scripts/lib
    baseUrl: '',


    urlArgs: "bust=" + (new Date()).getTime(),

    paths: {
        /* External dependencies */
        'jquery':               'scripts/lib/jquery',
        'underscore':           'scripts/lib/underscore',
        'backbone':             'scripts/lib/backbone',
        'handlebars':           'scripts/lib/handlebars',
        'bootstrap':            'scripts/lib/bootstrap',
        'text':                 'scripts/lib/text',
        'jquery-sortable':      'scripts/lib/jquery.sortable',
        'Tests':                'tests',

        /* Adform dependencies */
        'adform-checkbox':      'scripts/lib/adform-checkbox',
        'adform-select':        'scripts/lib/adform-select',
        'adform-notifications': 'scripts/lib/adform-notifications',

        /* Config dependencies */
        'Config':               'scripts/config/config',

        /* Base Views */
        'BaseDestructableView': 'scripts/views/baseDestructableView',
        'BaseCompositeView':    'scripts/views/baseCompositeView',

        /* Model dependencies */
        'Component':            'scripts/models/component',
        'Metric':               'scripts/models/metric',
        'Dashboard':            'scripts/models/dashboard',
        'DashboardComponent':   'scripts/models/dashboardComponent',

        /* Collection dependencies */
        'ComponentCollection':  'scripts/collections/componentCollection',
        'MetricCollection':     'scripts/collections/metricCollection',
        'DashboardCollection':  'scripts/collections/dashboardCollection',
        'DashboardComponentCollection': 'scripts/collections/dashboardComponentCollection',
        

        /* View dependencies */
        'ComponentView':        'scripts/views/componentView',
        'ComponentListView':    'scripts/views/componentListView',
        'MenuView':             'scripts/views/menuView',
        'MetricView':           'scripts/views/metricView',
        'MetricListView':       'scripts/views/metricListView',
        'GenerateView':         'scripts/views/generateView',
        'ComponentGeneratedView': 'scripts/views/componentGeneratedView',
        'DashboardListView':    'scripts/views/dashboardListView',
        'DashboardView':        'scripts/views/dashboardView',
        'DashboardComponentView': 'scripts/views/dashboardComponentView',

        /* Router dependencies */
        'Router':               'scripts/routers/router'
    },

    shim: {
        'jquery': {
            exports: '$'
        },

        'backbone': {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },

        'underscore': {
            exports: '_'
        },

        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
        },

        'handlebars': {
            exports: 'Handlebars'
        },

        'jquery-sortable': {
            deps: ['jquery']
        },
        
        'adform-checkbox': {
            deps: ['jquery']
        },

        'adform-select': {
            deps: ['jquery', 'adform-checkbox', 'handlebars', 'bootstrap'],
            exports: 'AdformSelect'
        },

        'adform-notifications': {
            deps: ['jquery', 'backbone', 'underscore']
        },
        
    }

});


require(['Router', 'Config'],
    function (Router, Config) {
        console.log(Config);

        var app = new Router();
        app.initialize();
        Backbone.history.start();

});