requirejs.config({
    //By default load any module IDs from scripts/lib
    baseUrl: '',
    
    urlArgs: "bust=v2",

    //urlArgs: "bust=" + (new Date()).getTime(),

    paths: {
        /* External dependencies */
        'jquery':               'scripts/lib/jquery',
        'underscore':           'scripts/lib/underscore',
        'backbone':             'scripts/lib/backbone',
        'handlebars':           'scripts/lib/handlebars',
        'text':                 'scripts/lib/text',
        'jquery-sortable':      'scripts/lib/jquery.sortable',
        'spin':                 'scripts/lib/spin',
        'globalize':            'scripts/lib/globalize',
        'moment':               'scripts/lib/moment',

        /* Bootstrap components */
        'bootstrap-modal':      'scripts/lib/bootstrap/bootstrap-modal',
        'bootstrap-tooltip':    'scripts/lib/bootstrap/bootstrap-tooltip',

        /* Adform dependencies */
        'adform-checkbox':      'scripts/lib/adform-checkbox',
        'adform-select':        'scripts/lib/adform-select',
        'adform-select-group':  'scripts/lib/adform-select-group',
        'adform-notifications': 'scripts/lib/adform-notifications',
        'adform-loader':        'scripts/lib/adform-loader',
        'adform-modal':         'scripts/lib/adform-modal',
        'adform-calendar':      'scripts/lib/adform-calendar.v2.01',
        'adform-date': '        scripts/lib/adform-date',
        'adform-datepicker':    'scripts/lib/adform-datepicker',

        /* Config dependencies */
        'Config':               'scripts/config/config',

        /* Base Views */
        'BaseDestructableView': 'scripts/views/baseDestructableView',
        'BaseCompositeView':    'scripts/views/baseCompositeView',

        /* Model dependencies */
        'Component':            'scripts/models/component',
        'Metric':               'scripts/models/metric',
        'Dashboard':            'scripts/models/dashboard',
        'DashboardComponent': 'scripts/models/dashboardComponent',
        'Einstein':             'scripts/models/einstein',

        /* Collection dependencies */
        'ComponentCollection':  'scripts/collections/componentCollection',
        'MetricCollection':     'scripts/collections/metricCollection',
        'DashboardCollection':  'scripts/collections/dashboardCollection',


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
        'KPIView':              'scripts/views/kpiView',
        'DateFilterView':       'scripts/views/dateFilterView',
        'MessageView':          'scripts/views/messageView',


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

        'bootstrap-tooltip': {
            deps: ['jquery']
        },

        'bootstrap-modal': {
            deps: ['jquery']
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

        'adform-select-group': {
            deps: ['jquery', 'adform-checkbox', 'handlebars', 'bootstrap-tooltip'],
            exports: 'AdformSelect'
        },

        'adform-notifications': {
            deps: ['jquery', 'backbone', 'underscore']
        },
        'adform-datepicker': {
            deps: ['globalize', 'moment', 'adform-calendar', 'adform-date']
        },
        'adform-calendar': {
            deps: ['jquery'],
        },
        
        'adform-modal': {
            deps: ['bootstrap-modal', 'spin']
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