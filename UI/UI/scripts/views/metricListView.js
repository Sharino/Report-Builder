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
            'click #addMetric': 'addMetric'
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
            this.collection.sort();                                                // DEBUG: Sorting might not be required later as we implement features.
            this.$el.html(this.template({ "Metrics": this.collection.toJSON() })); // Render Metric list

            var self = this;
            /* Initialize sortable list. */
            $('.sortable').sortable({
                handle: '.handle.adf-icon-alt-drag',
                items: 'li',
                forcePlaceholderSize: true,
                placeholder: '<li>Placeholder</li>'
            }).bind('sortupdate', function (e, ui) {
                var draggedItem = self.collection.findWhere({ Order: ui.oldindex }); // The item user dragged

                if (ui.oldindex > ui.item.index()) {                                 // User dragged left
                    for (var i = ui.item.index(); i < ui.oldindex; i++) {            // For every item in between new id and old id we increase Order, because it shifted right by 1
                        var item = self.collection.at(i);                            // Get item at array position [i]. Position is NOT Order, it is just insert position.
                        item.set({ Order: i + 1 });                                  // Increase order by 1
                    }
                    draggedItem.set({ Order: ui.item.index() });                     // Set new Order to dragged item.
                }
                else {                                                               // User dragged right
                    for (var i = ui.oldindex + 1; i <= ui.item.index() ; i++) {      // Same idea all over, just decrease the order cuz items shifted left.
                        var item = self.collection.at(i);
                        item.set({ Order: i - 1 });
                    }
                    draggedItem.set({ Order: ui.item.index() });
                }
                self.render();                                                       // DEBUG: Rerender list. Currently we show order in braces, ex.: {Metric title}{Position} ({Order})
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