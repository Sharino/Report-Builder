define('MetricListView', [
   'BaseCompositeView',
   'Metric',
   'MetricCollection',
   'text!templates/metricList.html',
   'MetricDimensionMap',
   'Config',
   'adform-select-group',
   'jquery-sortable'
], function (BaseCompositeView, Metric, MetricCollection, MetricListTemplate, MetricDimensionMap, Config, ASG) {
    var MetricListView = BaseCompositeView.extend({
        template: _.template(MetricListTemplate),

        events: {
            'click #addMetric': 'metricAddedAction',
            'click .removeMetric': 'metricRemovedAction',
        },

        initialize: function (parentModel, allMetrics) {
            MetricDimensionMap.metricView = this;
            Config.metricView = this;
            this.metricArray = [];
            this.selectReferences = [];
            this.model = parentModel;
            this.metricArray = this.model.get("Metrics").slice(0);

            for (var i = 0; i < this.metricArray.length; i++) {
                this.metricArray[i].Order = i;
            }
            this.allMetrics = allMetrics;
        },

        inputMetrics: function () {
            var result = [];

            this.metricArray.forEach(function (metric) {
                if (!metric.Placeholder) {
                    result.push(metric);
                }
            });

            return result;
        },

        render: function () {
            var self = this;
            this.metricArray.sort(this.compareNumbers);

            this.mappedMetrics = MetricDimensionMap.calculateMetricMap();

            if (!this.mappedMetrics) {
                this.mappedMetrics = this.allMetrics.toJSON();
            }

            this.grouped = _.groupBy(this.mappedMetrics, function (metric) {
                return metric.Group.GroupId;
            });
            this.$el.html(this.template({ "Metrics": this.metricArray, "Grouped": this.grouped }));

            this.initializeMetricSelects();
            this.initializeSortableList();
            return this;
        },

        metricAddedAction: function () {
            this.metricArray.push({ Placeholder: true, Order: this.metricArray.length, MetricId: -1 });
            this.render();
        },

        initializeMetricSelects: function () {
            var self = this;
            var metricSelectArray = this.$el.find('select.metric-select').get();

            if (metricSelectArray.length !== 0) {
                var singleMetricSelectReference = new ASG(metricSelectArray, { groups: true, adjustDropperWidth: true, search: true, footer: false, width: 'container' });

                if (metricSelectArray.length === 1) {
                    // Strange approach, I know, but if Select element array has only one element, object reference is saved in the variable, not in $selector.data
                    // So we push that value to its $.data and later use general forEach
                    $(metricSelectArray[0]).data("AdformSelect", singleMetricSelectReference);
                }

                this.selectReferences = [];

                metricSelectArray.forEach(function (singleMetricSelect) {
                    var reference = $(singleMetricSelect).data("AdformSelect");
                    reference.on("AdformSelect:close", function () { self.metricSelectedAction(this); });
                    self.selectReferences.push(reference);
                });

                for (var i = 0; i < this.metricArray.length; i++) {
                    if (!this.metricArray[i].Placeholder) {
                        this.selectReferences[i].setValues([this.metricArray[i].MetricId]);
                    }
                }

                $('.list-pop').tooltip({
                    delay: {
                        show: 300,
                        hide: 200
                    },
                    template: '<div class="tooltip info" style="overflow: overlay;  z-index: 9999;"><div class="tooltip-inner"></div></div>'
                });
            }

        },

        metricSelectedAction: function (e) {
            //var reference = $(e.target).data("AdformSelect");

            var reference = e;

            var selectReferenceID = null;
            for (var i = 0, len = this.selectReferences.length; i < len; i++) {
                if (this.selectReferences[i] === reference) {
                    selectReferenceID = i;
                    break;
                }
            }
            var selectedValue = parseInt(reference.getValues());

            if (!isNaN(selectedValue)) {
                var metric = this.allMetrics.get(selectedValue);
                metric.set({ Order: selectReferenceID });
                this.metricArray[selectReferenceID] = metric.toJSON();
                delete this.metricArray[selectReferenceID].Placeholder;
            }

            Config.dimensionView.render(); // TODO: Possibly if nothing is selected we could not render this at all. Look into it.
        },

        initializeSortableList: function () {
            var self = this;

            var sort = $('#sortable-metrics').sortable({
                handle: '.handle.adf-icon-alt-drag',
                items: 'li',
                placeholder: '<div class="sortable-placeholder"><label id="sortable-placeholder-text"></label></div>',
            });

            sort.bind('sortupdate', function (e, ui) {
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
        },


        metricRemovedAction: function (e) {
            var myId = parseInt(e.currentTarget.id);

            if (myId > -1) {
                this.metricArray.splice(myId, 1);
            }

            Config.dimensionView.render();
            this.render();
        },

        compareNumbers: function (a, b) {
            var x = parseInt(a.Order);
            var y = parseInt(b.Order);

            return x - y;
        }

    });

    return MetricListView;
});