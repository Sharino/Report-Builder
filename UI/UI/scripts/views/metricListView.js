define('MetricListView', [
   'BaseCompositeView',
   'Metric',
   'MetricCollection',
   'text!templates/metricList.html',
   'Config',
   'adform-select-group',
   'jquery-sortable'
], function (BaseCompositeView, Metric, MetricCollection, MetricListTemplate, Config, ASG) {
    var MetricListView = BaseCompositeView.extend({
        template: _.template(MetricListTemplate),

        events: {
            'click #addMetric': 'metricAddedAction',
            'AdformSelect:selectionChanged': 'metricSelectedAction',
            'click .removeMetric': 'metricRemovedAction',
        },

        calculateMap: function (e) {
            var array = this.sibling.dimensionArray;
            var configMap = Config.map.DimensionMappings;
            this.lastIntersection = configMap[0].MetricIds;
            for (var i = 0; i < array.length; i++) {
                this.lastIntersection = _.intersection(configMap[array[i].DimensionId].MetricIds, this.lastIntersection);
            }//todo slice
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

        initialize: function (parentModel, allMetrics) {
            this.metricArray = [];
            this.selectReferences = [];
            this.model = parentModel;
            this.metricArray = this.model.get("Metrics").slice(0);

            for (var i = 0; i < this.metricArray.length; i++) {
                this.metricArray[i].Order = i;
            }
            this.allMetrics = allMetrics;
        },

        render: function () {
            var self = this;

            this.metricArray.sort(this.compareNumbers);

            var metrics = this.allMetrics.toJSON().slice(0);
            var intersect = self.lastIntersection;
            var toRemove = [];

            for (var i = 0; i < metrics.length; i++) {
                if (intersect) {
                    var flag = false;
                    for (var j = 0; j < intersect.length; j++) {
                        if (metrics[i].MetricId == intersect[j]) {
                            flag = false;
                            break;
                        } else {
                            flag = true;
                        }
                    }
                    if (flag === true) {
                        toRemove.push(metrics[i]);
                    }
                }
            }
            
            for (var i = 0; i < toRemove.length; i++) {
                console.log("Deleting metric - ", toRemove[i].DisplayName);
                metrics = _.without(metrics, toRemove[i]);
            }

            this.grouped = _.groupBy(metrics, function (metric) {
                return metric.Group.GroupId;
            });

            this.$el.html(this.template({ "Metrics": this.metricArray, "Grouped": this.grouped }));

            //var adfSelectReference1 = new ASG(this.$el.find('select.adf-select1'), { groups: true, adjustDropperWidth: true, search: 6, width: 'container' });

            this.initializeMetricSelects();
            this.initializeSortableList();
            return this;
        },

        metricAddedAction: function () {
            this.metricArray.push({ Placeholder: true, Order: this.metricArray.length });
            this.calculateMap();
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
                    self.selectReferences.push(reference);
                });

                for (var i = 0; i < this.metricArray.length; i++) {
                    if (!this.metricArray[i].Placeholder) {
                        this.selectReferences[i].setValues([this.metricArray[i].MetricId]);
                    }
                }

                $('.list-pop').tooltip({
                    delay: {
                        show: 1000,
                        hide: 500
                    },
                    template: '<div class="tooltip info" style="width: 100%;"><div class="tooltip-inner"></div></div>'
                });
            }

        },

        metricSelectedAction: function (e) {
            var reference = $(e.target).data("AdformSelect");

            var selectReferenceID = null;
            for (var i = 0, len = this.selectReferences.length; i < len; i++) {
                if (this.selectReferences[i] === reference) {
                    selectReferenceID = i;
                    break;
                }
            }
            var selectedValue = parseInt(reference.getValues());
            var displayName = this.allMetrics.get(selectedValue).get("DisplayName");
            var mnemonic = this.allMetrics.get(selectedValue).get("Mnemonic");

            this.metricArray[selectReferenceID] = new Metric({ MetricId: selectedValue, Order: selectReferenceID, DisplayName: displayName, Mnemonic: mnemonic }).toJSON();
            delete this.metricArray[selectReferenceID].Placeholder;
        },

        initializeSortableList: function () {
            var self = this;

            var sort = $('.sortable').sortable({
                handle: '.handle.adf-icon-alt-drag',
                items: 'li',
                //forcePlaceholderSize: true,
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
            this.calculateMap();
            var myId = parseInt(e.currentTarget.id);

            if (myId > -1) {
                this.metricArray.splice(myId, 1);
            }

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