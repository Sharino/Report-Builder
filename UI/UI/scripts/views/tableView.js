define('TableView', [
    'BaseCompositeView',
    'text!templates/table.html',
    'DateFilterView',
    'Einstein',
    'Metric',
    'Dimension',
    'ComponentButtonView',
    'Config',
    'spin',
    'adform-loader',
    'bootstrap-dropdown'
], function (BaseCompositeView, TableTemplate, DateFilterView, Einstein, Metric, Dimension, ComponentButtonView, Config) {

    var tableView = BaseCompositeView.extend({
        template: _.template(TableTemplate),

        events: {
            'click .table-menu .selectedDimension': 'selectDimension',
            'click #table th': 'sortTable'
        },

        initialize: function (parent, pos, origin, dateview) {
            this.origin = origin;
            this.model = parent;
            this.position = pos;
            this.dateView = dateview;

            var dimensions = this.model.get("Dimensions");

            this.selectedDimension = new Dimension(dimensions[0]);
            this.selectedDimension.fetch();
            if (!String.prototype.includes) {
                String.prototype.includes = function () {
                    return String.prototype.indexOf.apply(this, arguments) !== -1;
                };
            }
        },

        render: function () {
            if (this.origin === 'preview') {
                var start = moment().subtract(7, 'days').format('YYYY-MM-DD');
                var end = moment().subtract(1, 'days').format('YYYY-MM-DD');

            } else {
                var start = this.dateView.datePicker.getSelectedDate();
                var end = this.dateView.datePicker2.getSelectedDate();
            }

            var einstein = new Einstein({
                Model: {
                    Metrics: this.model.get('Metrics'),
                    Dimensions: [this.selectedDimension.toJSON()]
                },
                Start: start,
                End: end
            });

            var self = this;

            einstein.save({}, {
                success: function (result) {
                    self.einstein = self.getProcessedEinsteinData(result);

                    self.$el.html(self.template({
                        Einstein: self.einstein,
                        Metrics: self.model.get('Metrics'),
                        model: self.model.toJSON(),
                        Position: self.position || 0,
                        ComponentID: self.model.id,
                        SelectedDimension: self.selectedDimension.get("DisplayName"),
                        SelectedDimensionMnemonic: self.selectedDimension.get("Mnemonic"),
                        TotalValues: self.getTotalValues(),
                        Data: self.einstein//self.getProcessedEinsteinData(result)
                    }));

                    var dimElement = "li#" + self.selectedDimension.get("DimensionId") + ".selectedDimension";
                    self.$el.find(dimElement).siblings('li').removeClass('active');
                    self.$el.find(dimElement).addClass('active');

                    self.renderSubview("#component-buttons", new ComponentButtonView(self.position + 1, self.model, self.origin));
                    var comparisonKey = this.$el.find(e.currentTarget).attr('id');
                    var sortableHeader = "th#" + comparisonKey + ".sortable";
                    this.$el.find(sortableHeader).append('<div class="icon-hidden"><a><i class="adf-icon-small-arrow-down"></i></a></div>');
                },
                error: function (resp) {
                    console.log("fail");
                }
            });
            //this.$el.find('#table th').append('<div class="icon-hidden"><a><i class="adf-icon-small-arrow-down"></i></a></div>');

            return this;
        },

        selectDimension: function (e) {
            e.preventDefault();

            var selectedId = parseInt(e.currentTarget.id);
            var dimensions = this.model.get("Dimensions");
            var selectedDimension = null;
            for (var i = 0, len = dimensions.length; i < len; i++) {
                var tempDimension = new Metric(dimensions[i]);
                if (tempDimension.get("DimensionId") === selectedId) {
                    selectedDimension = tempDimension;
                    break;
                }
            }
            this.selectedDimension = selectedDimension;
            this.render();
        },

        sortTable: function (e) {
            this.$el.find(e.currentTarget).addClass('active');
            this.einstein = this.getProcessedEinsteinData();

            var comparisonKey = this.$el.find(e.currentTarget).attr('id');
            var sortableHeader = "th#" + comparisonKey + ".sortable";

            if (!this.sortDirection || this.comparisonKey != comparisonKey) {
                this.sortDirection = 1;
                this.einstein.sort(this.compareOnKey(comparisonKey));
                this.render(this.einstein, this.dataFilter);

                this.$el.find(sortableHeader).append('<div class="icon-hidden"><a><i class="adf-icon-small-arrow-up"></i></a></div>');
                this.comparisonKey = comparisonKey;
            } else {
                if (this.sortDirection === 1) {
                    this.einstein.reverse();
                    this.render(this.einstein, this.dataFilter);

                    this.$el.find(sortableHeader).append('<div class="icon-hidden"><a><i class="adf-icon-small-arrow-down"></i></a></div>');
                } else {
                    this.einstein.sort(this.compareOnKey(this.$el.find(e.currentTarget).attr('id')));
                    this.render(this.einstein, this.dataFilter);

                    this.$el.find(sortableHeader).append('<div class="icon-hidden"><a><i class="adf-icon-small-arrow-up"></i></a></div>');

                }
                this.sortDirection *= -1;
            }


            this.$el.find(sortableHeader).addClass('active');
            this.$el.find(sortableHeader).siblings('th').append('<div class="icon-hidden"><a><i class="adf-icon-small-arrow-down"></i></a></div>');

        },

        getTotalValues: function () {
            var values = [];
            if (this.einstein) {
                if (this.einstein[0].MetricValues) {
                    for (var i = 0, iLen = this.einstein[0].MetricValues.length; i < iLen; i++) {
                        var sum = 0;
                        for (var j = 0, jLen = this.einstein.length; j < jLen; j++) {
                            var strVal = this.einstein[j].MetricValues[i].Value;
                            sum += parseFloat(strVal);
                        }
                        values.push(Math.round(sum * 100) / 100);
                    }
                } else {
                    for (var i = 0, iLen = this.einstein.length; i < iLen; i++) {
                        var dimensionMetricsValues = _.values(this.einstein[i]);
                        for (var j = 1, jLen = dimensionMetricsValues.length; j < jLen; j++) {
                            if (values.length >= jLen - 1) {
                                values[j - 1] += parseFloat(dimensionMetricsValues[j]);
                            } else {
                                values.push(parseFloat(dimensionMetricsValues[j]));
                            }
                        }
                    }
                }
            }
            return values;
        },

        getProcessedEinsteinData: function (einstein) {

            einstein = einstein.attributes.ComponentValues;

            var result = [];
            for (var i = 0, einsteinLen = einstein.length; i < einsteinLen; i++) {
                var dimensionKey = einstein[i].DimensionValues[0].Key;
                var dimensionValue = einstein[i].DimensionValues[0].Value;

                var dimension = {};
                dimension[dimensionKey] = dimensionValue;

                for (var j = 0, metricsLen = einstein[i].MetricValues.length; j < metricsLen; j++) {
                    var key = einstein[i].MetricValues[j].Key;
                    var value = einstein[i].MetricValues[j].Value;

                    var temp = {};
                    temp[key] = value;

                    _.extend(dimension, temp);
                }

                result.push(dimension);
            }
            return result;
        },

        compareOnKey: function (key) {
            return function (a, b) {
                tmpA = parseInt(a[key], 10);
                tmpB = parseInt(b[key], 10);

                if (tmpA && tmpB) {
                    a = tmpA;
                    b = tmpB;
                } else {
                    a = a[key];
                    b = b[key];
                }

                if (a < b) {
                    return (-1);
                }
                if (a > b) {
                    return 1;
                }
                return 0;
            };
        }


    });

    return tableView;
});