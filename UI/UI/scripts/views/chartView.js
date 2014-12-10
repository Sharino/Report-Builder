define('ChartView', [
    'BaseCompositeView',
    'text!templates/chart.html',
    'DateFilterView',
    'HighchartsChartView',
    'Einstein',
    'Metric',
    'Dimension',
    'ComponentButtonView',
    'Config',
    'Highcharts',
    'spin',
    'adform-loader',
    'bootstrap-dropdown'
], function (BaseCompositeView, ChartTemplate, DateFilterView, HighchartsChartView, Einstein, Metric, Dimension, ComponentButtonView, Config, Highcharts) {

    var chartView = BaseCompositeView.extend({

        template: _.template(ChartTemplate),

        events: {
            'click .chart-menu .dropdown-menu li': 'selectMetric',
            'click .chart-menu .selectedDimension': 'selectDimension'
        },

        initialize: function (parent, pos, origin, dateview) {
            this.origin = origin;
            this.model = parent;
            this.position = pos;
            this.dateView = dateview;

            this.selectedMetrics = [];

            var metrics = this.model.get("Metrics");
            var dimensions = this.model.get("Dimensions");

            this.selectedMetrics.push(metrics[0]);

            if (metrics.length > 1) {
                this.selectedMetrics.push(metrics[1]);
            }
            this.selectedDimension = new Dimension(dimensions[0]);
        },

        render: function () {
            var einstein = new Einstein({
                Model: {
                    Metrics: this.selectedMetrics,
                    Dimensions: [this.selectedDimension.toJSON()]
                },
                Start: this.dateView.datePicker.getSelectedDate(),
                End: this.dateView.datePicker2.getSelectedDate()
            });

            var metrics = this.model.get("Metrics");
            var selectedMetricsNames = [];

            selectedMetricsNames.push(this.selectedMetrics[0].DisplayName);

            if (metrics.length > 1) {
                selectedMetricsNames.push(this.selectedMetrics[1].DisplayName);
            }

            var self = this;

            einstein.save({}, {
                success: function () {
                    self.$el.html(self.template({
                      //  Einstein: einstein.toJSON,
                        Metrics: self.model.get('Metrics'),
                        model: self.model.toJSON(),
                        Position: self.position || 0,
                        ComponentID: self.model.id,
                        selectedMetrics: selectedMetricsNames,
                        selectedDimension: self.selectedDimension.get("DisplayName"),
                    }));

                    var dimElement = "li#" + self.selectedDimension.get("DimensionId") + ".selectedDimension";
                    self.$el.find(dimElement).siblings('li').removeClass('active');
                    self.$el.find(dimElement).addClass('active');

                    var metrElement = "li#" + self.selectedMetrics[0].MetricId + ".selectedMetric1";
                    self.$el.find(metrElement).siblings('li').removeClass('active');
                    self.$el.find(metrElement).addClass('active');

                    if (self.selectedMetrics.length > 1) {
                        metrElement = "li#" + self.selectedMetrics[1].MetricId + ".selectedMetric2";
                        self.$el.find(metrElement).siblings('li').removeClass('active');
                        self.$el.find(metrElement).addClass('active');
                    }

                    self.renderSubview("#highcharts", new HighchartsChartView({
                        model: self.model,
                        einstein: einstein.toJSON(),
                        selectedMetricsNames: selectedMetricsNames,
                    }));

                    self.renderSubview("#component-buttons", new ComponentButtonView(self.position + 1, self.model, self.origin));
                },
                error: function (resp) {
                    console.log("fail", resp);
                }
            });
            return this;
        },

        selectMetric: function (e) {
            e.preventDefault();
            var selectedId = parseInt(e.currentTarget.id);
            var metrics = this.model.get("Metrics");
            var selectedMetric = null;
            for (var i = 0, len = metrics.length; i < len; i++) {
                var tempMetric = new Metric(metrics[i]);
                if (tempMetric.get("MetricId") === selectedId) {
                    selectedMetric = tempMetric;
                    break;
                }
            }

            if ($(e.currentTarget).hasClass("selectedMetric1")) {
                this.selectedMetrics[0] = selectedMetric.toJSON();
                this.render();
            } else if ($(e.currentTarget).hasClass("selectedMetric2")) {
                this.selectedMetrics[1] = selectedMetric.toJSON();
                this.render();
            }
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
            this.render();
        },

    });

    return chartView;
});