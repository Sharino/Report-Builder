define('Router', [
    'jquery',
    'underscore',
    'backbone',
    'Component',
    'ComponentCollection',
    'ComponentView',
    'ComponentListView',
    'MenuView'
], function ($, _, Backbone, Component, ComponentCollection, ComponentView, ComponentListView, MenuView) {
    var Router;
    
    Router = Backbone.Router.extend({
        routes: {
            "": "index",
            "create": "create",
            "create/:id": "createById",
            "list": "list"
        },

        index: function () {
            
        },

        create: function () {
            this.showView("#screen", new ComponentView());
        },

        list: function () {
            var that = this; // To use Router methods in callback function.

            this.ComponentsCollection = new ComponentCollection();
            this.ComponentsCollection.fetch({
                success: function (result) {
                    console.log("fetch OK", result.toJSON());
                    that.showView("#screen", new ComponentListView({ collection: result }));
                },
                error: function () {
                    console.log("fetch FAIL");
                    that.showView("#screen", new ComponentListView({ collection: null }));

                }
            });
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