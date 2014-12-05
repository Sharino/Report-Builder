define('TimelineView', [
    'BaseCompositeView',
    'text!templates/timeline.html',
    'DateFilterView',
    'HighchartsTimelineView',
    'Einstein',
    'Metric',
    'Dimension',
    'ComponentButtonView',
    'Config',
    'Highcharts',
    'spin',
    'adform-loader',
    'bootstrap-dropdown'
], function (BaseCompositeView, TimelineTemplate, DateFilterView, HighchartsTimelineView, Einstein, Metric, Dimension, ComponentButtonView, Config, Highcharts) {

    var timelineView = BaseCompositeView.extend({
        template: _.template(TimelineTemplate),

        events: {
            'click #generateByDate': 'generateNewData',
            'click .timelineEdit': 'edit',
            'click .timeline-menu .dropdown-menu li': 'selectMetric',
            'click .timeline-menu .selectedDimension': 'selectDimension'
        },

        startDate: moment().format('YYYY-MM-DD'),

        initialize: function (parent, pos, origin) {
            this.origin = origin;
            this.model = parent;
            this.position = pos;
            this.initEinstein( moment().subtract('days', 7).format('YYYY-MM-DD'),this.startDate);

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
                if (this.origin === "preview") {
                    from = this.startDate;
                    to = moment().add('days', 7).format('YYYY-MM-DD');
                
                } else {

                    from = this.startDate;
                    to = moment().add('days', 7).format('YYYY-MM-DD');
                }
            } else {
                if (this.origin === "preview") {
                    from = this.startDate;
                    to = moment().add('days', 7).format('YYYY-MM-DD');
               
                } else {
                    from = $("#picker").find("input")[0].value;
                    to = $("#picker2").find("input")[0].value;
                }
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

            if (this.origin !== "preview") {
                this.renderSubview("#date-filter", new DateFilterView({
                    from: from,
                    to: to
                }));
            }
            this.renderSubview("#component-buttons", new ComponentButtonView(this.position + 1, this.model, this.origin));

            this.einstein = einstein;
            this.dataFilter = dataFiler;

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

            if ($(e.currentTarget).hasClass("selectedMetric1")) {
                this.selectedMetrics[0] = selectedMetric;
                this.generateNewData();
            } else if ($(e.currentTarget).hasClass("selectedMetric2")) {
                this.selectedMetrics[1] = selectedMetric;
                this.generateNewData();
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
            this.generateNewData();
        },

    });

    return timelineView;
});