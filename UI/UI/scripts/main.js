requirejs.config({
    //By default load any module IDs from scripts/lib
    baseUrl: '',
    paths: {
        'jquery': 'scripts/lib/jquery',
        'underscore': 'scripts/lib/underscore',
        'backbone': 'scripts/lib/backbone',
        'handlebars': 'scripts/lib/handlebars',
        'bootstrap': 'scripts/lib/bootstrap',
        'Tests': 'tests',
        'jquery-sortable': 'scripts/lib/jquery.sortable',
        'adform-checkbox': 'scripts/lib/adform-checkbox',
        'adform-select': 'scripts/lib/adform-select',
        'App': 'scripts/models/app',
        'Router' : 'scripts/routers/router',
        'Component': 'scripts/models/component',
        'ComponentCollection': 'scripts/collections/componentCollection',
        'ComponentView': 'scripts/views/componentView',
        'ComponentListView': 'scripts/views/componentListView',
        'MenuView': 'scripts/views/menuView'

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