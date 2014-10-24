requirejs.config({
    //By default load any module IDs from scripts/lib
    baseUrl: '',

    //urlArgs: "bust=" + (new Date()).getTime(),

    paths: {
        /* External dependencies */
        'jquery':               'scripts/lib/jquery',
        'underscore':           'scripts/lib/underscore',
        'backbone':             'scripts/lib/backbone',
        'handlebars':           'scripts/lib/handlebars',
        'bootstrap':            'scripts/lib/bootstrap',
        'text':                 'scripts/lib/text',
        'jquery-sortable':      'scripts/lib/jquery.sortable',
        'spin':                 'scripts/lib/spin',

        /* Adform dependencies */
        'adform-checkbox':      'scripts/lib/adform-checkbox',
        'adform-select':        'scripts/lib/adform-select',
        'adform-select-group':  'scripts/lib/adform-select-group',
        'adform-notifications': 'scripts/lib/adform-notifications',
        'adform-loader':        'scripts/lib/adform-loader',


        /* Config dependencies */
        'Config':               'scripts/config/config',

        /* Base Views */
        'BaseDestructableView': 'scripts/views/baseDestructableView',
        'BaseCompositeView':    'scripts/views/baseCompositeView',

        /* Model dependencies */
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
        'GenerateView':         'scripts/views/generateView',
        'ComponentGeneratedView':'scripts/views/componentGeneratedView',

        /* Router dependencies */
        'Router':               'scripts/routers/router',

        'Tests': 'tests',

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

        'spin':{
            deps: ['jquery'],
            exports: 'Spinner'
        },

        'handlebars': {
            exports: 'Handlebars'
        },

        'jquery-sortable': {
            deps: ['jquery']
        },
        
        'adform-loader': {
            deps: ['jquery', 'spin']
        },

        'adform-checkbox': {
            deps: ['jquery']
        },

        'adform-select': {
            deps: ['jquery', 'adform-checkbox', 'handlebars', 'bootstrap'],
            exports: 'AdformSelect'
        },

        'adform-select-group': {
            deps: ['jquery', 'adform-checkbox', 'handlebars', 'bootstrap'],
            exports: 'AdformSelect'
        },

        'adform-notifications': {
            deps: ['jquery', 'backbone', 'underscore']
        },
        
    }

});


require(['Router', 'Config', 'adform-loader'],
    function (Router, Config) {
        //console.log(Config);

        var app = new Router();
        Backbone.history.start();

        //$('#list').loader();
    });