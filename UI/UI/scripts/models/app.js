define('App', [
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'Router'
], function ($, _, Backbone, Router) {
    function initialize() {
        //var app = new Router();
        Backbone.history.start();
    }
    return {
        initialize: initialize
    };
});