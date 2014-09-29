define('App', [
    'jquery',
    'underscore',
    'backbone',
    'Router'
], function ($, _, Backbone, Router) {
    function initialize() {
        var appRouter = new Router();
        Backbone.history.start();
    }
    return {
        initialize: initialize
    };
});