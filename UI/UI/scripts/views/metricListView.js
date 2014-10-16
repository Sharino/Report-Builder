define('MetricListView', [
    'jquery',
    'underscore',
    'backbone',
    'BaseCompositeView',
    'Sortable',
    'Metric',
    'MetricCollection',
    'text!templates/metricList.html',
    'Config',
    'adform-checkbox',
    'handlebars',
    'adform-select'
], function ($, _, Backbone, BaseCompositeView, Sortable, Metric, MetricCollection, MetricListTemplate, Config, ac, h, as) {
    var MetricListView;

    MetricListView = BaseCompositeView.extend({
        template: _.template(MetricListTemplate),

        events: {
            'click #addMetric': 'metricAddedAction',
            'AdformSelect:selectionChanged': 'metricSelectedAction'
        },

        initialize: function (parentModel, allMetrics) {
            var self = this;

            this.selectReferences = [];

            this.model = parentModel;
       
            this.metricArray = this.model.get("Metrics");

            for (var i = 0; i < this.metricArray.length; i++) {
                this.metricArray[i].Order = i;
            }

            this.allMetrics = allMetrics;
        },

        render: function () {
            var self = this;

            this.metricArray.sort(function (a, b) {
                return a.Order - b.Order;
            });

            this.$el.html(this.template({ "Metrics": this.metricArray, "AllMetrics": this.allMetrics.toJSON() })); // Render Metric list

            this.initializeMetricSelects();

            this.initializeSortableList();

            return this;
        },

        metricAddedAction: function () {
            this.metricArray.push({ Placeholder: true });
            this.render();
        },

        initializeMetricSelects: function () {
            var self = this;

            var metricSelectArray = this.$el.find('select.metric-select').get();

            if (metricSelectArray.length !== 0) {
                var singleMetricSelectReference = new AdformSelect(metricSelectArray, { adjustDropperWidth: true, search: true, footer: false, width: 'container' });

                if (metricSelectArray.length === 1) {
                    // Strange approach, I know, but if Select element array has only one element, object reference is saved in the variable, not in $selector.data
                    // So we push that value to its $.data and later use general forEach
                    $(metricSelectArray[0]).data("AdformSelect", singleMetricSelectReference);
                }

                this.selectReferences = [];

                metricSelectArray.forEach(function (singleMetricSelect) {
                    var reference = $(singleMetricSelect).data("AdformSelect");
                    self.selectReferences.push(reference);
                });

                for (var i = 0; i < this.metricArray.length; i++) {
                    if (!this.metricArray[i].Placeholder) {
                        this.selectReferences[i].setValues([this.metricArray[i].MetricId]);
                    }
                }
            }
        },

        metricSelectedAction: function (e) {
            var reference = $(e.target).data("AdformSelect");

            var selectReferenceID = null;
            for (var i = 0; i < this.selectReferences.length; i++) {
                if (this.selectReferences[i] === reference) {
                    selectReferenceID = i;
                    break;
                }
            }

            var selectedValue = parseInt(reference.getValues());
            var displayName = this.allMetrics.get(selectedValue).get("DisplayName");

            this.metricArray[selectReferenceID] = new Metric({ MetricId: selectedValue, Order: selectReferenceID, DisplayName: displayName }).toJSON();
            delete this.metricArray[selectReferenceID].Placeholder;
        },

        initializeSortableList: function () {
            var self = this;

            $('.sortable').sortable({
                handle: '.handle.adf-icon-alt-drag',
                items: 'li',
                //forcePlaceholderSize: true,
                placeholder: '<li>Placeholder</li>'
            }).bind('sortupdate', function (e, ui) {
                self.metricDraggedAction(e, ui);
            });
        },

        metricDraggedAction: function (e, ui) {
            var draggedItem = null;
            for (var i = 0; i < this.metricArray.length; i++) {
                if (this.metricArray[i].Order == ui.oldindex) {
                    draggedItem = this.metricArray[i];
                }
            }


            if (ui.oldindex > ui.item.index()) {                                    // User dragged left
                for (var i = ui.item.index() ; i < ui.oldindex; i++) {              // For every item in between new id and old id we increase Order, because it shifted right by 1
                    var item = this.metricArray[i];
                    item.Order = i + 1;                                             // Increase order by 1
                }
                draggedItem.Order = ui.item.index();                                // Set new Order to dragged item.
            }
            else {                                                                  // User dragged right
                for (var i = ui.oldindex + 1; i <= ui.item.index() ; i++) {         // Same idea all over, just decrease the order cuz items shifted left.
                    var item = this.metricArray[i];
                    item.Order = i - 1;
                }
                draggedItem.Order = ui.item.index();
            }
            this.render();
        }

    });

    return MetricListView;
});