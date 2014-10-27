define('DashboardComponentCollection', [
    'jquery',
    'underscore',
    'backbone',
    'DashboardComponent',
    'Config'
], function ($, _, Backbone, DashboardComponent, Config) {
    var DashboardCollection;

    DashboardCollection = Backbone.Collection.extend({
        model: DashboardComponent,
    });

    return DashboardCollection;
});