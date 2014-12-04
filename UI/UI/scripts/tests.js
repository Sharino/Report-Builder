requirejs.config({
    baseUrl: '',

    urlArgs: "bust=" + (new Date()).getTime(),

    paths: {
        /* External dependencies */
        'jquery': 'scripts/lib/jquery',
        'underscore': 'scripts/lib/underscore',
        'backbone': 'scripts/lib/backbone',
        'qunit': 'scripts/lib/qunit',
        'sinon': 'scripts/lib/sinon',


        /* Config dependencies */
        'Config': 'scripts/config/config',

        /* Model dependencies */
        'Component': 'scripts/models/component',
        'Metric': 'scripts/models/metric',
        'Dashboard': 'scripts/models/dashboard',
        'DashboardComponent': 'scripts/models/dashboardComponent',
        'Dimension': 'scripts/models/dimension',
        'Einstein': 'scripts/models/einstein',

        /* Collection dependencies */
        'ComponentCollection': 'scripts/collections/componentCollection',
        'MetricCollection': 'scripts/collections/metricCollection',
        'DashboardCollection': 'scripts/collections/dashboardCollection',
        'DimensionCollection': 'scripts/collections/dimensionCollection',
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

        'qunit': {
            exports: 'QUnit',
            init: function () {
                QUnit.config.autoload = false;
                QUnit.config.autostart = false;
            }
        }
    }

});


require([
    'jquery',
    'underscore',
    'backbone',
    'qunit',
    'sinon',
    'Config',
	'Component',
    'Metric',
    'Dimension',
    'Dashboard'
], function ($, _, Backbone, QUnit, Sinon, Config, Component, Metric, Dimension, Dashboard) {

    /* COMPONENT */

    module("Component Initialization");

    test("Empty Component initialization with new Component()", function () {
        expect(6);

        var comp = new Component();

        deepEqual(comp.get("Title"), "", "Default title is an empty string.");
        deepEqual(comp.get("Id"), undefined, "Default Id is not defined.");
        deepEqual(comp.get("Type"), 1, "Default type is 1");
        deepEqual(comp.get("Metrics"), [], "Default Metrics are empty array.");
        deepEqual(comp.get("Dimensions"), [], "Default Dimensions are empty array.");
        deepEqual(comp.get("Filters"), [], "Default Filters are empty array.");
    });

    test("Custom Component initialization. Empty metrics, dimensions, filters. ", function () {
        expect(7);

        var comp = new Component({ Id: 7, Title: "test", Type: 2 });

        deepEqual(comp.get("Title"), "test", "Title sets/gets correctly.");
        deepEqual(comp.get("Id"), 7, "Id sets/gets correctly.");
        deepEqual(comp.get("Type"), 2, "Type sets/gets correctly.");
        deepEqual(comp.get("Metrics"), [], "Metrics sets/gets correctly.");
        deepEqual(comp.get("Dimensions"), [], "Dimensions sets/gets correctly.");
        deepEqual(comp.get("Filters"), [], "Filters sets/gets correctly.");
        deepEqual(comp.isNew(), false, "Model is not new (has Id).");
    });

    test("Custom Component initialization. With metric and dimension.", function () {
        expect(7);

        var metrics = [];
        metrics.push(new Metric().toJSON());

        var dimensions = [];
        dimensions.push(new Dimension().toJSON());

        var comp = new Component({ Id: 7, Title: "test", Type: 2, Metrics: metrics, Dimensions: dimensions });

        deepEqual(comp.get("Title"), "test", "Title sets/gets correctly.");
        deepEqual(comp.get("Id"), 7, "Id sets/gets correctly.");
        deepEqual(comp.get("Type"), 2, "Type sets/gets correctly.");
        deepEqual(comp.get("Metrics"), metrics, "Metrics sets/gets correctly.");
        deepEqual(comp.get("Dimensions"), dimensions, "Dimensions sets/gets correctly.");
        deepEqual(comp.get("Filters"), [], "Filters sets/gets correctly.");
        deepEqual(comp.isNew(), false, "Model is not new (has Id).");
    });

    /* --- */

    module("Component Validation");

    test("No title", function () {
        expect(2);

        var metrics = [];
        metrics.push(new Metric().toJSON());
        var comp = new Component({ Title: "", Type: 1, Metrics: metrics });

        deepEqual(comp.isValid(), false, validationErrorToString(comp.validationError));
        deepEqual(comp.validationError[0].code, 521, "Title error fired.");
    });

    test("Lame type 27", function () {
        expect(2);

        var comp = new Component({ Title: "normal", Type: 27 });

        deepEqual(comp.isValid(), false, validationErrorToString(comp.validationError));
        deepEqual(comp.validationError[0].code, 524, "Type error fired");
    });

    test("Lame type -27", function () {
        expect(2);

        var comp = new Component({ Title: "normal", Type: -27 });

        deepEqual(comp.isValid(), false, validationErrorToString(comp.validationError));
        deepEqual(comp.validationError[0].code, 524, "Type error fired");
    });

    /* --- */

    module("Component KPI Validation");

    test("KPI: Short title, No metrics", function () {
        expect(3);

        var comp = new Component({ Title: "b" });

        deepEqual(comp.isValid(), false, validationErrorToString(comp.validationError));
        deepEqual(comp.validationError[0].code, 522, "Title error fired");
        deepEqual(comp.validationError[1].code, 525, "Metric error fired");
    });

    test("KPI: Long title, No metrics", function () {
        expect(3);

        var comp = new Component({ Title: "hurr durr hurr durr herp derp super man iron man yeeeay naaaay" });

        deepEqual(comp.isValid(), false, validationErrorToString(comp.validationError));
        deepEqual(comp.validationError[0].code, 523, "Title error fired");
        deepEqual(comp.validationError[1].code, 525, "Metric error fired");
    });

    test("KPI: No metrics", function () {
        expect(2);

        var comp = new Component({ Title: "normal" });

        deepEqual(comp.isValid(), false, validationErrorToString(comp.validationError));
        deepEqual(comp.validationError[0].code, 525, "Metric error fired");
    });

    /* --- */

    module("Component TABLE Validation");

    test("TABLE: No metrics, No dimensions", function () {
        expect(3);

        var comp = new Component({ Title: "normal", Type: 2 });

        deepEqual(comp.isValid(), false, validationErrorToString(comp.validationError));
        deepEqual(comp.validationError[0].code, 525, "Metric error fired");
        deepEqual(comp.validationError[1].code, 526, "Dimension error fired");
    });

    test("TABLE: No dimensions", function () {
        expect(2);

        var metrics = [];
        metrics.push(new Metric().toJSON());

        var comp = new Component({ Title: "normal", Type: 2, Metrics: metrics });

        deepEqual(comp.isValid(), false, validationErrorToString(comp.validationError));
        deepEqual(comp.validationError[0].code, 526, "Dimension error fired");
    });

    test("TABLE: No metrics", function () {
        expect(2);

        var dimensions = [];
        dimensions.push(new Dimension().toJSON());

        var comp = new Component({ Title: "normal", Type: 2, Dimensions: dimensions });

        deepEqual(comp.isValid(), false, validationErrorToString(comp.validationError));
        deepEqual(comp.validationError[0].code, 525, "Metric error fired");
    });

    test("TABLE: Valid", function () {
        expect(1);

        var dimensions = [];
        dimensions.push(new Dimension().toJSON());

        var metrics = [];
        metrics.push(new Metric().toJSON());

        var comp = new Component({ Title: "normal", Type: 2, Dimensions: dimensions, Metrics: metrics });

        deepEqual(comp.isValid(), true, validationErrorToString(comp.validationError));
    });

    /* --- */

    module("Component TIMELINE Validation");

    test("TIMELINE: No metrics, No dimensions", function () {
        expect(3);

        var comp = new Component({ Title: "normal", Type: 3 });

        deepEqual(comp.isValid(), false, validationErrorToString(comp.validationError));
        deepEqual(comp.validationError[0].code, 525, "Metric error fired");
        deepEqual(comp.validationError[1].code, 526, "Dimension error fired");
    });

    test("TIMELINE: No dimensions", function () {
        expect(2);

        var metrics = [];
        metrics.push(new Metric().toJSON());

        var comp = new Component({ Title: "normal", Type: 3, Metrics: metrics });

        deepEqual(comp.isValid(), false, validationErrorToString(comp.validationError));
        deepEqual(comp.validationError[0].code, 526, "Dimension error fired");
    });

    test("TIMELINE: No metrics", function () {
        expect(2);

        var dimensions = [];
        dimensions.push(new Dimension().toJSON());

        var comp = new Component({ Title: "normal", Type: 3, Dimensions: dimensions });

        deepEqual(comp.isValid(), false, validationErrorToString(comp.validationError));
        deepEqual(comp.validationError[0].code, 525, "Metric error fired");
    });

    test("TIMELINE: Valid", function () {
        expect(1);

        var dimensions = [];
        dimensions.push(new Dimension().toJSON());

        var metrics = [];
        metrics.push(new Metric().toJSON());

        var comp = new Component({ Title: "normal", Type: 3, Dimensions: dimensions, Metrics: metrics });

        deepEqual(comp.isValid(), true, validationErrorToString(comp.validationError));
    });

    /* --- */

    module("Component CHART Validation");

    test("CHART: No metrics, No dimensions", function () {
        expect(3);

        var comp = new Component({ Title: "normal", Type: 3 });

        deepEqual(comp.isValid(), false, validationErrorToString(comp.validationError));
        deepEqual(comp.validationError[0].code, 525, "Metric error fired");
        deepEqual(comp.validationError[1].code, 526, "Dimension error fired");
    });

    test("CHART: No dimensions", function () {
        expect(2);

        var metrics = [];
        metrics.push(new Metric().toJSON());

        var comp = new Component({ Title: "normal", Type: 3, Metrics: metrics });

        deepEqual(comp.isValid(), false, validationErrorToString(comp.validationError));
        deepEqual(comp.validationError[0].code, 526, "Dimension error fired");
    });

    test("CHART: No metrics", function () {
        expect(2);

        var dimensions = [];
        dimensions.push(new Dimension().toJSON());

        var comp = new Component({ Title: "normal", Type: 3, Dimensions: dimensions });

        deepEqual(comp.isValid(), false, validationErrorToString(comp.validationError));
        deepEqual(comp.validationError[0].code, 525, "Metric error fired");
    });

    test("CHART: Valid", function () {
        expect(1);

        var dimensions = [];
        dimensions.push(new Dimension().toJSON());

        var metrics = [];
        metrics.push(new Metric().toJSON());

        var comp = new Component({ Title: "normal", Type: 3, Dimensions: dimensions, Metrics: metrics });

        deepEqual(comp.isValid(), true, validationErrorToString(comp.validationError));
    });

    /* COMPONENT PUT/POST/GET/DELETE Mocks*/
    
    module('Component Save', {
        setup: function () {
            this.testDataPOST = {
                "Title": "erhywehweh",
                "SubmissionDate": "2014-12-02 04:15:46",
                "ModificationDate": "2014-12-02 04:15:46",
                "Type": 2,
                "Metrics": [
                    {
                        "MetricId": 9,
                        "Group": {
                            "GroupId": 1,
                            "GroupName": "ADVENTURE"
                        },
                        "DisplayName": "eCPM",
                        "Description": "I'm looking for a miracle man.",
                        "DataType": "int",
                        "Mnemonic": "m_eCPM"
                    },
                    {
                        "MetricId": 7,
                        "Group": {
                            "GroupId": 1,
                            "GroupName": "ADVENTURE"
                        },
                        "DisplayName": "Creative Settings Bid Count",
                        "Description": "I'm Batman",
                        "DataType": "int",
                        "Mnemonic": "m_CreativeSettingsBidCount"
                    }
                ],
                "Dimensions": [
                    {
                        "DimensionId": 7,
                        "Mnemonic": "d_MasterTag",
                        "Group": {
                            "GroupId": 3,
                            "GroupName": "TECHNICAL"
                        },
                        "DisplayName": "Master Tag",
                        "Description": "The Grand Master of Tags.",
                        "DataType": "int"
                    }
                ],
                "Filters": []
            };

            this.testDataPUT = {
                "Title": "erhywehweh",
                "SubmissionDate": "2014-12-02 04:15:46",
                "ModificationDate": "2014-12-02 04:15:46",
                "Id": 999,
                "Type": 2,
                "Metrics": [
                    {
                        "MetricId": 9,
                        "Group": {
                            "GroupId": 1,
                            "GroupName": "ADVENTURE"
                        },
                        "DisplayName": "eCPM",
                        "Description": "I'm looking for a miracle man.",
                        "DataType": "int",
                        "Mnemonic": "m_eCPM"
                    },
                    {
                        "MetricId": 7,
                        "Group": {
                            "GroupId": 1,
                            "GroupName": "ADVENTURE"
                        },
                        "DisplayName": "Creative Settings Bid Count",
                        "Description": "I'm Batman",
                        "DataType": "int",
                        "Mnemonic": "m_CreativeSettingsBidCount"
                    }
                ],
                "Dimensions": [
                    {
                        "DimensionId": 7,
                        "Mnemonic": "d_MasterTag",
                        "Group": {
                            "GroupId": 3,
                            "GroupName": "TECHNICAL"
                        },
                        "DisplayName": "Master Tag",
                        "Description": "The Grand Master of Tags.",
                        "DataType": "int"
                    }
                ],
                "Filters": []
            };

            this.server = Sinon.fakeServer.create();
        },
        teardown: function () {
            this.server.restore();
            this.testDataPOST = null;
            this.testDataPUT = null;
        }
    });

    test('Saving new Component (POST)', function () {
        expect(4);

        var model = new Component(this.testDataPOST);

        deepEqual(model.isValid(), true, 'Model is valid and ready to save.');

        model.save();

        var request = this.server.requests[0];
        deepEqual(request.method, 'POST', 'Request type is POST');
        deepEqual(request.url, Config.ComponentSettings.URL, "Request URL is correct.");
        deepEqual(JSON.parse(request.requestBody), this.testDataPOST, 'Correct Data passed.');

    });

    test('Saving new Component (PUT)', function () {
        expect(4);

        var model = new Component(this.testDataPUT);

        deepEqual(model.isValid(), true, 'Model is valid and ready to save.');

        model.save();

        var request = this.server.requests[0];
        deepEqual(request.method, 'PUT', 'Request type is PUT');
        deepEqual(request.url, Config.ComponentSettings.URL + "/" + this.testDataPUT.Id, "Request URL is correct.");
        deepEqual(JSON.parse(request.requestBody), this.testDataPUT, 'Correct Data passed.');

    });

    /* --- */

    module("Component Fetch", {
        setup: function () {
            var testDataGET = {
                "Title": "erhywehweh",
                "Id": 95,
                "SubmissionDate": "2014-12-02 04:15:46",
                "ModificationDate": "2014-12-02 04:15:46",
                "Type": 2,
                "Metrics": [
                  {
                      "MetricId": 9,
                      "Group": {
                          "GroupId": 1,
                          "GroupName": "ADVENTURE"
                      },
                      "DisplayName": "eCPM",
                      "Description": "I'm looking for a miracle man.",
                      "DataType": "int",
                      "Mnemonic": "m_eCPM"
                  },
                  {
                      "MetricId": 7,
                      "Group": {
                          "GroupId": 1,
                          "GroupName": "ADVENTURE"
                      },
                      "DisplayName": "Creative Settings Bid Count",
                      "Description": "I'm Batman",
                      "DataType": "int",
                      "Mnemonic": "m_CreativeSettingsBidCount"
                  }
                ],
                "Dimensions": [
                  {
                      "DimensionId": 7,
                      "Mnemonic": "d_MasterTag",
                      "Group": {
                          "GroupId": 3,
                          "GroupName": "TECHNICAL"
                      },
                      "DisplayName": "Master Tag",
                      "Description": "The Grand Master of Tags.",
                      "DataType": "int"
                  }
                ],
                "Filters": []
            };

            this.server = Sinon.fakeServer.create();
            this.server.respondWith("GET", Config.ComponentSettings.URL, [200, { "Content-Type": "application/json" }, JSON.stringify(testDataGET)]);
        },
        teardown: function () {
            this.server.restore();
            this.testDataGET = null;
        }
    });

    test("Fetching Component (GET)", function (assert) {
        assert.expect(8);
        var done = assert.async();

        var model = new Component({ id: 95 });
        model.fetch();

        this.server.respond();

        deepEqual(model.get("Title"), "erhywehweh", "Correct Title");
        deepEqual(model.get("Id"), 95, "Correct Id");
        deepEqual(model.get("SubmissionDate"), "2014-12-02 04:15:46", "Correct SubmissionDate");
        deepEqual(model.get("ModificationDate"), "2014-12-02 04:15:46", "Correct ModificationDate");
        deepEqual(model.get("Type"), 2, "Correct Type");
        deepEqual(model.get("Metrics").length, 2, "Correct Metrics Count");
        deepEqual(model.get("Dimensions").length, 1, "Correct Dimensions Count");
        deepEqual(model.get("Filters").length, 0, "Correct Filters Count");

        done();
    });

    /* --- */

    module('Component Delete', {
        setup: function () {
            this.server = Sinon.fakeServer.create();
        },
        teardown: function () {
            this.server.restore();
        }
    });

    test("Destroying Component (DELETE)", function (assert) {
        assert.expect(2);
        var done = assert.async();
        var Id = 95;
        var model = new Component({ Id: Id });
        model.destroy();

        this.server.respond();

        var request = this.server.requests[0];
        deepEqual(request.method, 'DELETE', 'Request type is DELETE');
        deepEqual(request.url, Config.ComponentSettings.URL + "/" + Id, "Request URL is correct.");

        done();
    });

    /* DASHBOARD */

    module("Dashboard Initializaion");

    test("Can be instantiated with correct default values", function () {
        expect(4);

        var dashboard = new Dashboard();

        deepEqual(dashboard.get("Title"), "", "The title is an empty string.");
        deepEqual(dashboard.get("Id"), undefined, "Id is not defined.");
        deepEqual(dashboard.get("Components"), [], "Components are empty.");
        deepEqual(dashboard.get("ComponentIds"), [], "ComponentIds are empty.");
    });

    test("Can be set up with custom values. Values can be get correctly.", function () {
        expect(4);

        var dashboard = new Dashboard({ Id: 7, Title: "test", });

        deepEqual(dashboard.get("Title"), "test", "The title is an empty string.");
        deepEqual(dashboard.get("Id"), 7, "Id is not defined.");
        deepEqual(dashboard.get("Components"), [], "Components sets/gets correctly.");
        deepEqual(dashboard.get("ComponentIds"), [], "ComponentIds sets/gets correctly.");
    });

    test("No title", function () {
        expect(2);

        var dashboard = new Dashboard({ Title: "" });

        deepEqual(dashboard.isValid(), false, validationErrorToString(dashboard.validationError));
        deepEqual(dashboard.validationError[0].code, 621, "Title error fired.");
    });

    test("Short title", function () {
        expect(2);

        var dashboard = new Dashboard({ Title: "sh" });

        deepEqual(dashboard.isValid(), false, validationErrorToString(dashboard.validationError));
        deepEqual(dashboard.validationError[0].code, 622, "Title error fired.");
    });

    test("Long title", function () {
        expect(2);

        var dashboard = new Dashboard({ Title: "hurr durr yolo sweg awadawd kawdk awkd awkd kawd kawkd awkd awkd akwd a" });

        deepEqual(dashboard.isValid(), false, validationErrorToString(dashboard.validationError));
        deepEqual(dashboard.validationError[0].code, 623, "Title error fired.");
    });

    /* --- */


    /* Utility */
    function validationErrorToString(errObj) {
        var result = "";

        if (errObj) {
            errObj.forEach(function (err) {
                result += err.message + " (Code: " + err.code + ") ";
            });

            return result;
        }
        else return "No errors";
    }

    QUnit.load();
    QUnit.start();
});