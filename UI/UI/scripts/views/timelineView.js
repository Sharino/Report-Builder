﻿define('TimelineView', [
    'BaseCompositeView',
    'text!templates/timeline.html',
    'DateFilterView',
    'HighchartsTimelineView',
    'Einstein',
    'Metric',
    'Dimension',
    'Highcharts',
    'spin',
    'adform-loader',
    'bootstrap-dropdown'
], function (BaseCompositeView, TimelineTemplate, DateFilterView, HighchartsTimelineView, Einstein, Metric, Dimension, Highcharts) {

    var startDate = moment().format('YYYY-MM-DD');

    var timelineView = BaseCompositeView.extend({
        template: _.template(TimelineTemplate),

        events: {
            'click #generateByDate': 'generateNewData',
            'click .timelineEdit': 'edit',
            'click .timeline-menu .dropdown-menu li': 'selectMetric',
            'click .timeline-menu .selectedDimension': 'selectDimension'
        },

        initialize: function (parent, pos) {
            this.model = parent;
            this.position = pos;
            this.initEinstein(startDate, startDate);

            this.selectedMetrics = [];

            var metrics = this.model.get("Metrics");
            var dimensions = this.model.get("Dimensions");
            this.selectedMetrics.push(new Metric(metrics[0]));
            if (metrics.length > 1) {
                this.selectedMetrics.push(new Metric(metrics[Math.min(1, metrics.length - 1)]));
            }
            this.selectedDimension = new Dimension(dimensions[0]);
        },

        render: function (einstein, dataFiler) {
            if (!einstein && !dataFiler) {
                einstein = 'garbage';
                from = startDate;
                to = startDate;
            } else {
                //                console.log(dataFiler);
                from = $("#picker").find("input")[0].value;
                to = $("#picker2").find("input")[0].value;
            }

            var metrics = this.model.get("Metrics");
            var selectedMetricsNames = [];
            selectedMetricsNames.push(this.selectedMetrics[0].get("DisplayName"));
            if (metrics.length > 1) {
                selectedMetricsNames.push(this.selectedMetrics[1].get("DisplayName"));
            }
            
            this.$el.html(this.template({
                Einstein: einstein,
                Metrics: this.model.get('Metrics'),
                model: this.model.toJSON(),
                Position: this.position || 0,
                ComponentID: this.model.id,
                selectedMetrics: selectedMetricsNames,
                selectedDimension: this.selectedDimension.get("DisplayName"),
            }));

            var dimElement = "li#" + this.selectedDimension.get("DimensionId") + ".selectedDimension";
            this.$el.find(dimElement).siblings('li').removeClass('active');
            this.$el.find(dimElement).addClass('active');

            var metrElement = "li#" + this.selectedMetrics[0].get("MetricId") + ".selectedMetric1";
            this.$el.find(metrElement).siblings('li').removeClass('active');
            this.$el.find(metrElement).addClass('active');

            if (this.selectedMetrics.length > 1) {
                metrElement = "li#" + this.selectedMetrics[1].get("MetricId") + ".selectedMetric2";
                this.$el.find(metrElement).siblings('li').removeClass('active');
                this.$el.find(metrElement).addClass('active');
            }

            this.renderSubview("#highcharts", new HighchartsTimelineView({
                model: this.model,
                einstein: einstein,
                selectedMetricsNames: selectedMetricsNames,
            }));

            //            alert("Before render");
            this.renderSubview("#date-filter", new DateFilterView({
                from: from,
                to: to
            }));

            return this;
        },

        initEinstein: function (start, end) {
            if (!this.selectedDimension) {
                var dimensions = this.model.get("Dimensions");
                this.selectedDimension = new Dimension(dimensions[0]);
            }

            if (!this.selectedMetrics) {
                this.selectedMetrics = [];
                var metrics = this.model.get("Metrics");
                this.selectedMetrics.push(new Metric(metrics[0]));
                if (metrics.length > 1) {
                    this.selectedMetrics.push(new Metric(metrics[Math.min(1, metrics.length - 1)]));
                }
            }

            var metricMnemonics = [];
            for (var i = 0, len = this.selectedMetrics.length; i < len; i++) {
                metricMnemonics.push(this.selectedMetrics[i].get("Mnemonic"));
            }

            var einstein = new Einstein({
                Metrics: metricMnemonics,//this.getMetricMnemonics([this.selectedMetric1, this.selectedMetric2]),
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
                url: 'http://37.157.0.42:33896/api/Einstein/Data',
               // url: 'http://localhost:5000/api/Einstein/Data',
                data: JSON.stringify(stoneAlone),
                contentType: 'application/json',
                dataType: 'json',
                type: 'POST',
                processData: false,
                success: function (response) {
                    this.einstein = response.attributes.ComponentValues;
                    this.dataFilter = response.attributes.Filters.DateFilter;
                    self.render(response.attributes.ComponentValues, response.attributes.Filters.DateFilter);
                },
                error: function (error) {
                    console.log("Stone Alone FAIL");
                    console.log(error);
                }
            });
        },

        edit: function (e) {
            e.preventDefault();

            var id = $(e.currentTarget).attr("id");
            var routerUrl = "create/".concat(id);

            Backbone.history.navigate(routerUrl, true, true);

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

            if ($(e.currentTarget).attr('class').contains("selectedMetric1")) {
                this.selectedMetrics[0] = selectedMetric;
                this.render(this.einstein, this.dataFilter);
            } else if ($(e.currentTarget).attr('class').contains("selectedMetric2")) {
                this.selectedMetrics[1] = selectedMetric;
                this.render(this.einstein, this.dataFilter);
            }
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
            this.render(this.einstein, this.dataFilter);
        },



    });

    return timelineView;
});