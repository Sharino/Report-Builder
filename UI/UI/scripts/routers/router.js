define('Router', [
    'jquery',
    'underscore',
    'backbone',
    'Component',
    'ComponentCollection',
    'ComponentView',
    'ComponentListView',
    'Dashboard',
    'DashboardView',
    'DashboardComponent',
    'DashboardCollection',
    'DashboardListView',
    'MenuView',
    'GenerateView',
    'Config',
    'adform-notifications'
], function ($, _, Backbone, Component, ComponentCollection, ComponentView, ComponentListView, Dashboard, DashboardView, DashboardComponent, DashboardCollection, DashboardListView, MenuView, GenerateView, Config) {
    var Router = Backbone.Router.extend({
        routes: {
            "": "list",
            "create": "create",
            "create/:id": "createById",
            "list": "list",
            "generate/:id": "generateById",
            "dashboards": "dashboards",
            "dashboard/:id": "showDashboard"
        },

        index: function () {
            
        },

        create: function () {
            var tempComponent = new Component();
            this.showView("#component", new ComponentView({ model: tempComponent }));
        },

        showDashboard: function (id) {
            var self = this;
            var tempDashboardModel = new Dashboard({ Id: id });
            tempDashboardModel.fetch({
                success: function (model, response) {
                    console.log("GET", id, "Success", model, response);
                    self.showView("#generate", new DashboardView({ model: model }));
                },
                error: function (model, response) {
                    console.log("GET", id, "Fail", model, response);
                }
            });
        },

        dashboards: function () {
            var self = this; 

            this.DashboardCollection = new DashboardCollection();
            this.DashboardCollection.fetch({
                success: function (collection, response) {
                    console.log("fetch OK", collection.toJSON());
                    self.showView("#list", new DashboardListView({ collection: collection }));
                },
                error: function (collection, response) {
                    console.log("fetch FAIL", response);

                    $.notifications.display({       
                        type: 'error',
                        content: "Error fetching from server.",         
                        timeout: Config.NotificationSettings.Timeout
                    });

                    self.showView("#list", new DashboardListView({ collection: null }));
                }
            });
        },

        list: function () {
            var self = this; 

            this.ComponentsCollection = new ComponentCollection();
            this.ComponentsCollection.fetch({
                success: function (model, response) {
                    console.log("fetch OK", model.toJSON());
                    self.showView("#list", new ComponentListView({ collection: model }));
                },
                error: function (model, response) {
                    console.log("fetch FAIL", response);

                    $.notifications.display({       
                        type: 'error',
                        content: "Error fetching from server.",         
                        timeout: Config.NotificationSettings.Timeout
                    });
                    self.showView("#list", new ComponentListView({ collection: null }));
                }
            });
        },

        createById: function (id) {
            var self = this;
            var tempComponent = new Component({ Id: id });
            tempComponent.fetch({
                success: function (model, response) {
                    console.log("GET", id, "Success", model, response);
                    self.showView("#component", new ComponentView({model: model}));
                },
                error: function (model, response) {
                    console.log("GET", id, "Fail", model, response);
                }
            });

            tempComponent = null;
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
                this.currentView.destroy();
            $(selector).html(view.render().el);
            this.currentView = view;
            console.log("Opening view", this.currentView);
            return view;
        }
    });

    return Router;
});