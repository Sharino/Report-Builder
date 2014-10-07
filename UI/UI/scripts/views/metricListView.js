define('MetricListView', [
    'jquery',
    'underscore',
    'backbone',
    'Sortable',
    'Metric',
    'MetricCollection',
    'text!templates/metricList.html',

], function ($, _, Backbone, Sortable, Metric, MetricCollection, MetricListTemplate) {
    var MetricListView;

    MetricListView = Backbone.View.extend({
        template: _.template(MetricListTemplate),

        events: {
            'click #addMetric': 'addMetric',
        },

        initialize: function () {
            if (this.collection) {
                this.collection.on('add', this.render, this);
                this.collection.on('remove', this.render, this);
                this.collection.on('fetch', this.render, this);
            } else {
                this.collection = new MetricCollection();
                this.collection.on('remove', this.render, this);
                this.collection.on('fetch', this.render, this);
            }
            this.collection.on('add', this.render, this);
        },

        render: function () {
            this.$el.html(this.template({ "Metrics": this.collection.toJSON() })); // Render Metric list

            var self = this;
            /* Initialize sortable list. */
            $('.sortable').sortable({
                items: 'li',
                forcePlaceholderSize: true,
                placeholder: '<li>Placeholder</li>'
            }).bind('sortupdate', function (e, ui) {
                /* Get collection items with changed Order. */
                var firstItem = self.collection.findWhere({ Order: ui.oldindex });
                var secondItem = self.collection.findWhere({ Order: ui.item.index() });

                /* Set new Order to selected items. */
                firstItem.set({ Order: ui.item.index() });
                secondItem.set({ Order: ui.oldindex });
            });
        },

        addMetric: function () {
            this.collection.add([
               { Title: "Metric "  + this.collection.length, Order: this.collection.length }
            ]);

            console.log(this, this.collection.toJSON());
        }
    });

    return MetricListView;
});