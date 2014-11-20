define('Metric', [
    'jquery',
    'underscore',
    'backbone',
    'Config'
], function ($, _, Backbone, Config) {
    var Session = Backbone.Model.extend({
        idAttribute: "MetricId",

        urlRoot: Config.MetricSettings.URL,

        defaults: function () {
            this.set({
                Map: ""
            });
        },

        initialize: function() {
            this.load();
        },

        load: function() {
            this.save();
            user_id: $.cookie('user_id');
            access_token: $.cookie('access_token');
        },

        save: function() {
            $.cookie('user_id', auth_hash.id);
        },

        toString: function () {
            return this.DisplayName;
        }
    });

    return Metric;
});
