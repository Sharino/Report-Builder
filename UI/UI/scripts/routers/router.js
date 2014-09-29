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
            "create/(:id)": "createById",
            "list": "list",


            "help": "help",                    // #help
            "search/:query":        "search",  // #search/kiwis
            "search/:query/p:page": "search"   // #search/kiwis/p7
        },

        model: new Component(),

        index: function(){
            var menu = new MenuView({model: this.model});
            menu.render();
        },

        createById: function (id) {
            var menu = new MenuView({ model: this.model });
            menu.render();
           // $("#li1").toggleClass("active");

            var tempComponentModel = new Component({ Id: id });
            tempComponentModel.fetch({
                success: function (model, response) {
                    console.log("GET fetch GetAll- success", model, response);

                    var componentView = new ComponentView({
                        model: tempComponentModel
                    });

                    componentView.render();
                },
                error: function (model, response) {
                    console.log("GET fetch GetAll - error", model, response);
                }
            });

        },

        create: function () {
            var menu = new MenuView({ model: this.model });
            menu.render();
            $("#li1").toggleClass("active");

            var tempComponentModel = new Component();

            var componentView = new ComponentView({
                model: tempComponentModel
            });

            componentView.render();
        },

        list: function () {
            var menu = new MenuView({ model: this.model });
            menu.render();
            $("#li2").toggleClass("active");

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