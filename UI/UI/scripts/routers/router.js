define('Router', [
    'jquery',
    'underscore',
    'backbone',
    'Component',
    'ComponentCollection',
    'ComponentView',
    'ComponentListView'
], function ($, _, Backbone, Component, ComponentCollection, ComponentView, ComponentListView) {
    var Router;
    
    Router = Backbone.Router.extend({

        routes: {
            "": "index",
            "create": "create",
            "list": "list",


            "help": "help",                    // #help
            "search/:query":        "search",  // #search/kiwis
            "search/:query/p:page": "search"   // #search/kiwis/p7
        },

        index: function(){
            $(document.body).append("Index route has been called..");
        },

        create: function () {
            var tempComponentModel = new Component();

            var componentView = new ComponentView({
                model: tempComponentModel
            });

            componentView.render();
        },




        list: function(){
            var compList = new ComponentCollection;

            compList.fetch({
                success: function (model, response) {
                    console.log(compList.toJSON());
                    console.log("GET fetch GetAll- success", model, response);
                    var componentListView = new ComponentListView({ collection: compList });
                    componentListView.render();
                },
                error: function (model, response) {
                    console.log("GET fetch GetAll - error", model, response);
                }
            });
        },


        help: function() {
           // ...
        },

        search: function(query, page) {
           // ...
        }

    });

    return Router;
});