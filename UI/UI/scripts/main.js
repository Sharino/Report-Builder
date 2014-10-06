﻿requirejs.config({
    //By default load any module IDs from scripts/lib
    baseUrl: '',
    paths: {
        /* External dependencies */
        'jquery':               'scripts/lib/jquery',
        'underscore':           'scripts/lib/underscore',
        'backbone':             'scripts/lib/backbone',
        'handlebars':           'scripts/lib/handlebars',
        'bootstrap':            'scripts/lib/bootstrap',
        'jquery-sortable':      'scripts/lib/jquery.sortable',
        'adform-checkbox':      'scripts/lib/adform-checkbox',
        'adform-select':        'scripts/lib/adform-select',
        'adform-notifications': 'scripts/lib/adform-notifications',
        'Tests':                'tests',

        /* Model dependencies */
        'App':                  'scripts/models/app',
        'Component':            'scripts/models/component',
        'Metric':               'scripts/models/metric',

        /* Collection dependencies */
        'ComponentCollection':  'scripts/collections/componentCollection',

        /* View dependencies */
        'ComponentView':        'scripts/views/componentView',
        'ComponentListView':    'scripts/views/componentListView',
        'MenuView':             'scripts/views/menuView',
        'MetricView':           'scripts/views/metricView',

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
        'adform-select': {
            deps: ['backbone', 'handlebars']
        },
        'backbone-forms': {
            deps: ['backbone', 'jquery']
        }
    }
});


require(['Component', 'ComponentCollection', 'ComponentView', 'ComponentListView', 'MenuView', 'Router'],
    function (Component, ComponentCollection, ComponentView, ComponentListView, MenuView, Router) {
    
    Backbone.View.prototype.close = function () {
        console.log('Closing view', this);
        if (this.beforeClose) {
            this.beforeClose();
        }
        this.remove();
        this.unbind();
    };

    var app = new Router();
    app.initialize();
    Backbone.history.start();
});