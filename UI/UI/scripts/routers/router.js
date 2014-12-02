define('Router', [
    'jquery',
    'underscore',
    'backbone',
    'MetricDimensionMap',
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
    'text!templates/dashboardCreate.html',
    'adform-notifications',
    'adform-notifications',
    'globalize',
    'moment',
    'adform-datepicker',
    'adform-loader'
], function ($, _, Backbone, MetricDimensionMap, Component, ComponentCollection, ComponentView, ComponentListView, Dashboard, DashboardView, DashboardComponent, DashboardCollection, DashboardListView, MenuView, GenerateView, Config, DashboardCreate) {
    var Router = Backbone.Router.extend({
        routes: {
            "": "dashboards",
            "create": "create",
            "create/:id": "createById",
            "list": "list",
            "generate/:id": "generateById",
            "dashboards": "dashboards",
            "dashboard/:id": "showDashboard",
        },

        initialize: function () {
            Config.getMap();
            MetricDimensionMap.getMap();
            this.showMenu(new MenuView());
            this.on("route", this.menu.routeChangedAction);
        },

        create: function () {
            this.showView("#component", new ComponentView({ model: new Component() }));
        },

        showDashboard: function (id) {
            var self = this;
            var tempDashboardModel = new Dashboard({ Id: id });
            tempDashboardModel.fetch({
                success: function (model, response) {
                    self.showView("#generate", new DashboardView({ model: model }));
                },
                error: function () {}
            });
        },

        dashboards: function () {
            this.showView("#list", new DashboardListView({ collection: null }));
            $("#list").loader();

            var self = this;

            this.DashboardCollection = new DashboardCollection();
            this.DashboardCollection.fetch({
                success: function (collection, response) {
                    self.showView("#list", new DashboardListView({ collection: collection }));
                },
                error: function (collection, response) {
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
            this.showView("#list", new ComponentListView({ collection: null }));
            $("#list").loader();

            var self = this;

            this.ComponentsCollection = new ComponentCollection();
            this.ComponentsCollection.fetch({
                success: function (model) {
                    self.showView("#list", new ComponentListView({ collection: model }));
                },
                error: function () {
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
                    self.showView("#component", new ComponentView({ model: model }));
                    $("#app > div > div").addClass('page-split').pageSplit();
                },
                error: function (model, response) {
                }
            });
        },

        generateById: function (id) {
            var self = this;
            var tempComponentModel = new Component({ Id: id });

            tempComponentModel.fetch({
                success: function (model, response) {
                    self.showView("#generate", new GenerateView({ model: model }));
                },
                error: function (model, response) {
                }
            });
        },

        showView: function (selector, view) {
            if (this.currentView) {
                this.currentView.destroy();
            }
            $("#app").html(view.render().el);

            this.currentView = view;

            return view;
        },

        showMenu: function (view) {

            if (this.menu) {
                this.menu.destroy();
            }

            $("#menu").html(view.render().el);

            this.menu = view;
        }
    });

    return Router;
});