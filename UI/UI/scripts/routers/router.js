define('Router', [
    'jquery',
    'underscore',
    'backbone',
    'Component',
    'ComponentCollection',
    'ComponentView',
    'ComponentListView',
    'MenuView',
    'GenerateView',
    'adform-notifications',
    'Config'
], function ($, _, Backbone, Component, ComponentCollection, ComponentView,
             ComponentListView, MenuView, GenerateView, AdformNotification, Config) {
    var Router;
    
    Router = Backbone.Router.extend({
        routes: {
            "": "list",
            "create": "create",
            "create/:id": "createById",
            "list": "list",
            "generate/:id": "generateById"
        },

        index: function () {
            
        },

        create: function () {
            this.showView("#component", new ComponentView({ model: new Component() }));
        },

        list: function () {
            var self = this; // To use Router methods in callback function.

            this.ComponentsCollection = new ComponentCollection();
            this.ComponentsCollection.fetch({
                success: function (model, response) {
                    console.log("fetch OK", model.toJSON());
                    self.showView("#list", new ComponentListView({ collection: model }));
                },
                error: function (model, response) {
                    console.log("fetch FAIL", response);

                    AdformNotification.display({       // Show Adform notification.
                        type: 'error',
                        content: "Error fetching from server.",         // Shows message from server
                        timeout: Config.NotificationSettings.Timeout
                    });
                    self.showView("#list", new ComponentListView({ collection: null }));
                }
            });
        },

        createById: function (id) {
            var self = this;
            var tempComponentModel = new Component({ Id: id });
            tempComponentModel.fetch({
                success: function (model, response) {
                    console.log("GET", id, "Success", model, response);
                    self.showView("#component", new ComponentView({model: model}));
                },
                error: function (model, response) {
                    console.log("GET", id, "Fail", model, response);
                }
            });

            tempComponentModel = null;
        },

        generateById: function (id) {
            var self = this;
            var tempComponentModel = new Component({ Id: id });
            tempComponentModel.fetch({
                success: function (model, response) {
                    console.log("GET", id, "Success", model, response);
                    self.showView("#generate", new GenerateView({ model: model }));
                },
                error: function (model, response) {
                    console.log("GET", id, "Fail", model, response);
                }
            });

            tempComponentModel = null;
        },  

        showView: function(selector, view) {
            if (this.currentView)
                this.currentView.close();
            $(selector).html(view.render().el);
            this.currentView = view;
            return view;
        }
    });

    return Router;
});