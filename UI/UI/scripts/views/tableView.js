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
            'click #generateByDate': 'generateNewData',
            'click .tableEdit': 'edit',
            'click .table-menu .selectedDimension': 'selectDimension',
            'click #table th': 'sortTable'
        },

        startDate: moment().format('YYYY-MM-DD'),

        initialize: function (parent, pos, origin) {
            this.originDashboard = origin;
            this.model = parent;
            this.position = pos;
            this.initEinstein(this.startDate, this.startDate);
            
            var dimensions = this.model.get("Dimensions");
            this.selectedDimension = new Dimension(dimensions[0]);
            this.selectedDimension.fetch();

            if (!String.prototype.includes) {
                String.prototype.includes = function () {
                    return String.prototype.indexOf.apply(this, arguments) !== -1;
                };
            }
        },

        render: function (einstein, dataFiler) {
            if (!einstein || !dataFiler) {
                //this.initEinstein(this.startDate, this.startDate);
                einstein = 'garbage';
                from = this.startDate;
                to = this.startDate;
            } else {
                //                console.log(dataFiler);
                from = $("#picker").find("input")[0].value;
                to = $("#picker2").find("input")[0].value;
            }


            this.$el.html(this.template({
                Einstein: einstein,
                Metrics: this.model.get('Metrics'),
                model: this.model.toJSON(),
                Position: this.position || 0,
                ComponentID: this.model.id,
                SelectedDimension: this.selectedDimension.get("DisplayName"),
                SelectedDimensionMnemonic: this.selectedDimension.get("Mnemonic"),
                TotalValues: this.getTotalValues(),
                Data: this.getProcessedEinsteinData()
            }));

            var dimElement = "li#" + this.selectedDimension.get("DimensionId") + ".selectedDimension";
            this.$el.find(dimElement).siblings('li').removeClass('active');
            this.$el.find(dimElement).addClass('active');
            
            this.renderSubview("#date-filter", new DateFilterView({
                from: from,
                to: to
            }));

            this.renderSubview("#component-buttons", new ComponentButtonView(this.position, this.model, this.originDashboard));

            //this.$el.find('#table th').append('<div class="icon-hidden"><a><i class="adf-icon-small-arrow-down"></i></a></div>');

            this.einstein = einstein;
            this.dataFilter = dataFiler;

            return this;
        },

        initEinstein: function (start, end) {
            var metrics = this.model.get("Metrics");
            var dimensions = this.model.get("Dimensions");

            if (!this.selectedDimension) {
                this.selectedDimension = new Dimension(dimensions[0]);
                this.selectedDimension.fetch();
            }

            var metricMnemonics = [];
            for (var i = 0, len = metrics.length; i < len; i++) {
                var tempMetric = new Metric(metrics[i]);
                metricMnemonics.push(tempMetric.get("Mnemonic"));
            }

            var einstein = new Einstein({
                Metrics: metricMnemonics,
                Dimensions: [this.selectedDimension.get("Mnemonic")],
                Filters: {
                    "DateFilter": {
                        "From": start,
                        "To": end
                    }
                }
            });
            this.workEinstein(einstein);

        },

        generateNewData: function () {
            var startDate = $("#picker").find("input")[0].value;
            var endDate = $("#picker2").find("input")[0].value;

            if (startDate <= endDate) {
                this.initEinstein(startDate, endDate);
            } else {
                alert('back to the future');
            }

        },

        workEinstein: function (stoneAlone) {

            var self = this;

            stoneAlone.fetch({
                url: Config.EinsteinSettings.URL,
                data: JSON.stringify(stoneAlone),
                contentType: 'application/json',
                dataType: 'json',
                type: 'POST',
                processData: false,
                success: function (response) {
                    self.einstein = response.attributes.ComponentValues;
                    self.dataFilter = response.attributes.Filters.DateFilter;
                    self.render(self.einstein, self.dataFilter);
                },
                error: function (error) {
                    console.log("Stone Alone FAIL");
                    console.log("error:",error);
                }
            });

        },

        edit: function (e) {
            e.preventDefault();

            var id = $(e.currentTarget).attr("id");
            var routerUrl = "create/".concat(id);

            Backbone.history.navigate(routerUrl, true, true);

        },

        selectDimension: function (e) {
            e.preventDefault();

            var selectedId = parseInt(e.currentTarget.id);
            var dimensions = this.model.get("Dimensions");
            var selectedDimension = null;
            for (var i = 0, len = dimensions.length; i < len; i++) {
                var tempDimension = new Dimension(dimensions[i]);
                if (tempDimension.get("DimensionId") === selectedId) {
                    selectedDimension = tempDimension;
                    break;
                }
            }

            this.selectedDimension = selectedDimension;
            this.generateNewData();
        },

        sortTable: function(e) {
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
                            sum += strVal.includes(".") || strVal.includes(",") ? parseFloat(strVal) : parseInt(strVal);
                        }
                        values.push(Math.round(sum * 100) / 100);
                    }
                } else {
                    for (var i = 0, iLen = this.einstein.length; i < iLen; i++) {
                        var dimensionMetricsValues = _.values(this.einstein[i]);
                        for (var j = 1, jLen = dimensionMetricsValues.length; j < jLen; j++) {
                            if (values.length >= jLen-1) {
                                values[j - 1] += parseInt(dimensionMetricsValues[j]);
                            } else {
                                values.push(parseInt(dimensionMetricsValues[j]));
                            }
                        }
                    }
                }
            }
            return values;
        },
        
        getProcessedEinsteinData: function() {

            if (this.einstein && this.einstein[0].MetricValues) {
                var result = [];
                for (var i = 0, einsteinLen = this.einstein.length; i < einsteinLen; i++) {
                    var dimensionKey = this.einstein[i].DimensionValues[0].Key;
                    var dimensionValue = this.einstein[i].DimensionValues[0].Value;

                    var dimension = {};
                    dimension[dimensionKey] = dimensionValue;

                    for (var j = 0, metricsLen = this.einstein[i].MetricValues.length; j < metricsLen; j++) {
                        var key = this.einstein[i].MetricValues[j].Key;
                        var value = this.einstein[i].MetricValues[j].Value;

                        var temp = {};
                        temp[key] = value;
                        
                        _.extend(dimension, temp);
                    }

                    result.push(dimension);
                }
                return result;
            }

            return this.einstein;
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