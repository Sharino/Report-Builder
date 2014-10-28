define('DashboardCollection', [
    'jquery',
    'underscore',
    'backbone',
    'Dashboard',
    'Config'
], function ($, _, Backbone, Dashboard, Config) {
    var DashboardCollection;

    DashboardCollection = Backbone.Collection.extend({
        model: Dashboard,
        url: Config.DashboardSettings.URL
    });

    return DashboardCollection;
});