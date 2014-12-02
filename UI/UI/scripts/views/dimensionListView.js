define('DimensionListView', [
    'BaseCompositeView',
    'Dimension',
    'DimensionCollection',
    'text!templates/dimensionList.html',
    'MetricDimensionMap',
    'Config',
    'adform-select-group',
    'jquery-sortable'
], function (BaseCompositeView, Dimension, DimensionCollection, DimensionListTemplate, MetricDimensionMap, Config, ASG) {
    var DimensionListView = BaseCompositeView.extend({
        template: _.template(DimensionListTemplate),

        events: {
            'click #addDimension': 'dimensionAddedAction',
            'click .removeDimension': 'dimensionRemovedAction',
            'AdformSelect:close': 'dimensionSelectedAction'
        },

        initialize: function (parentModel, allDimensions) {
            Config.dimensionView = this;
            MetricDimensionMap.dimensionView = this;
            this.dimensionArray = [];
            this.selectReferences = [];
            this.model = parentModel;
            this.dimensionArray = this.model.get("Dimensions").slice(0);

            for (var i = 0; i < this.dimensionArray.length; i++) {
                this.dimensionArray[i].Order = i;
            }
            this.allDimensions = allDimensions;
        },


        inputDimensions: function () {
            var result = [];

            if (this.model.get("Type") === 3) {
                this.dimensionArray.forEach(function (dimension) {
                    if (!dimension.Placeholder && dimension.Group.GroupId === 1) {
                        result.push(dimension);
                    }
                });
            }
            else
            {
                this.dimensionArray.forEach(function (dimension) {
                    if (!dimension.Placeholder) {
                        result.push(dimension);
                    }
                });
            }

            return result;
        },

        render: function () {
            var self = this;

            this.dimensionArray.sort(this.compareNumbers);

            this.mappedDimensions = MetricDimensionMap.calculateDimensionMap();
            
            if (!this.mappedDimensions) {
                this.mappedDimensions = this.allDimensions.toJSON();
            }

            if (this.model.get("Type") === 3) {
                this.mappedDimensions = _.filter(this.mappedDimensions, function (item) { return item.Group.GroupId === 1; });
            }

            this.grouped = _.groupBy(this.mappedDimensions, function (dimension) {
                return dimension.Group.GroupId;
            });

            this.$el.html(this.template({ "Dimensions": this.dimensionArray, "Grouped": this.grouped }));

            this.initializeDimensionSelects();

            this.initializeSortableList();

            return this;
        },

        dimensionAddedAction: function () {
            this.dimensionArray.push({ Placeholder: true, Order: this.dimensionArray.length, DimensionId: -1 });
            this.render();
        },

        initializeDimensionSelects: function () {
            var self = this;

            var dimensionSelectArray = this.$el.find('select.dimension-select').get();

            if (dimensionSelectArray.length !== 0) {
                var singleDimensionSelectReference = new ASG(dimensionSelectArray, { groups: true, adjustDropperWidth: true, search: true, footer: false, width: 'container' });

                if (dimensionSelectArray.length === 1) {
                    // Strange approach, I know, but if Select element array has only one element, object reference is saved in the variable, not in $selector.data
                    // So we push that value to its $.data and later use general forEach
                    $(dimensionSelectArray[0]).data("AdformSelect", singleDimensionSelectReference);
                }

                this.selectReferences = [];

                dimensionSelectArray.forEach(function (singleDimensionSelect) {
                    var reference = $(singleDimensionSelect).data("AdformSelect");
                    reference.on("AdformSelect:close", function () { self.dimensionSelectedAction(this); });
                    self.selectReferences.push(reference);
                });

                for (var i = 0; i < this.dimensionArray.length; i++) {
                    if (!this.dimensionArray[i].Placeholder) {
                        this.selectReferences[i].setValues([this.dimensionArray[i].DimensionId]);
                    }
                }

                $('.list-pop').tooltip({
                    delay: {
                        show: 300,
                        hide: 200
                    },
                    template: '<div class="tooltip info" style="width: 100%;"><div class="tooltip-inner"></div></div>'
                });
            }
        },

        dimensionSelectedAction: function (e) {
            var reference = e;

            var selectReferenceID = null;
            for (var i = 0; i < this.selectReferences.length; i++) {
                if (this.selectReferences[i] === reference) {
                    selectReferenceID = i;
                    break;
                }
            }

            var selectedValue = parseInt(reference.getValues());

            if (!isNaN(selectedValue)) {
                var dimension = this.allDimensions.get(selectedValue);

                this.dimensionArray[selectReferenceID] = dimension.toJSON();
                delete this.dimensionArray[selectReferenceID].Placeholder;
            }

            Config.metricView.render();
        },

        initializeSortableList: function () {
            var self = this;

            $('#sortable-dimensions').sortable({
                handle: '.handle.adf-icon-alt-drag',
                items: 'li',
                placeholder: '<div class="sortable-placeholder"><label id="sortable-placeholder-text"></label></div>'
            }).bind('sortupdate', function (e, ui) {
                self.dimensionDraggedAction(e, ui);
            });
        },

        dimensionDraggedAction: function (e, ui) {
            var draggedItem = null;
            for (var i = 0; i < this.dimensionArray.length; i++) {
                if (this.dimensionArray[i].Order == ui.oldindex) {
                    draggedItem = this.dimensionArray[i];
                }
            }
            
            if (ui.oldindex > ui.item.index()) {                                    // User dragged left
                for (var i = ui.item.index() ; i < ui.oldindex; i++) {              // For every item in between new id and old id we increase Order, because it shifted right by 1
                    var item = this.dimensionArray[i];
                    item.Order = i + 1;                                             // Increase order by 1
                }
                draggedItem.Order = ui.item.index();                                // Set new Order to dragged item.
            }
            else {                                                                  // User dragged right
                for (var i = ui.oldindex + 1; i <= ui.item.index() ; i++) {         // Same idea all over, just decrease the order cuz items shifted left.
                    var item = this.dimensionArray[i];
                    item.Order = i - 1;
                }
                draggedItem.Order = ui.item.index();
            }
            this.render();
        },

        dimensionRemovedAction: function (e) {
            var myId = parseInt(e.currentTarget.id);

            if (myId > -1) {
                this.dimensionArray.splice(myId, 1);
            }

            Config.metricView.render();
            this.render();
        },

        compareNumbers: function (a, b) {
            var x = parseInt(a.Order);
            var y = parseInt(b.Order);

            return x - y;
        }
    });
    return DimensionListView;
});