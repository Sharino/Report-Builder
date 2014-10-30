requirejs.config({
    //By default load any module IDs from scripts/lib
    baseUrl: '',

    //urlArgs: "bust=" + (new Date()).getTime(),

    paths: {
        /* External dependencies */
        'jquery': 'scripts/lib/jquery',
        'underscore': 'scripts/lib/underscore',
        'backbone': 'scripts/lib/backbone',
        'handlebars': 'scripts/lib/handlebars',
        'bootstrap': 'scripts/lib/bootstrap',
        'text': 'scripts/lib/text',
        'jquery-sortable': 'scripts/lib/jquery.sortable',
        'qunit':            'scripts/lib/qunit',

        /* Adform dependencies */
        'adform-checkbox': 'scripts/lib/adform-checkbox',
        'adform-select': 'scripts/lib/adform-select',
        'adform-notifications': 'scripts/lib/adform-notifications',

        /* Config dependencies */
        'Config': 'scripts/config/config',

        /* Base Views */
        'BaseDestructableView': 'scripts/views/baseDestructableView',
        'BaseCompositeView': 'scripts/views/baseCompositeView',

        /* Model dependencies */
        'Component': 'scripts/models/component',
        'Metric': 'scripts/models/metric',

        /* Collection dependencies */
        'ComponentCollection': 'scripts/collections/componentCollection',
        'MetricCollection': 'scripts/collections/metricCollection',


        /* View dependencies */
        'ComponentView': 'scripts/views/componentView',
        'ComponentListView': 'scripts/views/componentListView',
        'MenuView': 'scripts/views/menuView',
        'MetricView': 'scripts/views/metricView',
        'MetricListView': 'scripts/views/metricListView',
        'GenerateView': 'scripts/views/generateView',
        'ComponentGeneratedView': 'scripts/views/componentGeneratedView',

        /* Router dependencies */
        'Router': 'scripts/routers/router'
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
        },

        'qunit': {
            exports: 'QUnit',
            init: function () {
                QUnit.config.autoload = false;
                QUnit.config.autostart = false;
            }
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
        }
    }

});


require([
    'jquery',
    'underscore',
    'backbone',
    'qunit',
	'Component',
    'Metric'
], function ($, _, Backbone, QUnit, Component, Metric) {

    module("Component Initialization");
    test("Can be instantiated with correct default values", function() {
        expect( 7 );

        var comp = new Component();

        deepEqual(comp.get("Title"), "", "The title is an empty string.");
        deepEqual(comp.get("Id"), undefined, "Id is not defined.");
        deepEqual(comp.get("Type"), 1, "Default type is 1");
        deepEqual(comp.get("Metrics"), [], "Metrics are empty.");
        deepEqual(comp.get("Dimensions"), [], "Dimensions are empty.");
        deepEqual(comp.get("Filters"), [], "Filters are empty.");
        deepEqual(comp.isNew(), true, "Model is new.");
    });

    test("Can be set up with custom values. Values can be get correctly.", function () {
        expect(7);

        var metrics = [];
        metrics.push(new Metric().toJSON());

        var comp = new Component({Id: 7, Title: "test", Type: 2, Metrics: metrics});
        
        deepEqual(comp.get("Title"), "test", "Title sets/gets correctly.");
        deepEqual(comp.get("Id"), 7, "Id sets/gets correctly.");
        deepEqual(comp.get("Type"), 2, "Type sets/gets correctly.");
        deepEqual(comp.get("Metrics"), metrics, "Metrics sets/gets correctly.");
        deepEqual(comp.get("Dimensions"), [], "Dimensions sets/gets correctly.");
        deepEqual(comp.get("Filters"), [], "Filters sets/gets correctly.");
        deepEqual(comp.isNew(), false, "Model is not new (has Id).");
    });

    //TODO
    //module("Component validation");
    //test("Correct Component validation.", function () {
    //    expect(1);
        
    //    var metrics = [];
    //    metrics.push(new Metric().toJSON());

    //    var comp = new Component({ Id: 7, Title: "test", Type: 2, Metrics: metrics });
    //    var validationSuccess = comp.validate(comp);

    //    var c;
       
    //    //

    //    //deepEqual(comp.validate(), "test", "Title sets/gets correctly.");
    //});














    QUnit.load();
    QUnit.start();
});



























//module( "Backbone.Model=>Report Setting Tests" );
//test("Can be set up with title: \"Lorem ipsum\", type: 5", function() {
//    // Number of Assertions we Expect
//    expect( 3 );

//    // Instantiate Local Contact Backbone Model Object
//    var rep = new Report({title: "Lorem ipsum", type: 5});

//    // Default Attribute Value Assertions
//    equal( rep.get("title"), "Lorem ipsum", "The title is set." );
//    equal( rep.get("id"), null, "Id is not defined." );
//    equal( rep.get("type"), 5, "Type is set to 5.");
//});


