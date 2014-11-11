﻿define('TimelineView', [
    'BaseCompositeView',
    'text!templates/timeline.html',
    'DateFilterView',
    'HighchartsTimelineView',
    'Einstein',
    'Metric',
    'Highcharts',
    'spin',
    'adform-loader',
], function (BaseCompositeView, TimelineTemplate, DateFilterView, HighchartsTimelineView, Einstein, Metric, Highcharts) {

    var startDate = moment().format('YYYY-MM-DD');

    var timelineView = BaseCompositeView.extend({
        template: _.template(TimelineTemplate),

        events: {
            'click #generateByDate': 'generateNewData',
            'click .timelineEdit': 'edit'
        },

        initialize: function (parent, pos) {
            this.model = parent;
            this.position = pos;
            this.initEinstein(startDate, startDate);
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
            
            this.$el.html(this.template({
                Einstein: einstein,
                Metrics: this.model.get('Metrics'),
                model: this.model.toJSON(),
                Position: this.position || 0,
                ComponentID: this.model.id
            }));

            this.renderSubview("#highcharts-timeline", new HighchartsTimelineView({
                model: this.model,
                einstein: einstein,
            }));

            //            alert("Before render");
            this.renderSubview("#date-filter", new DateFilterView({
                from: from,
                to: to
            }));

            return this;
        },

        initEinstein: function (start, end) {

            var einstein = new Einstein({
                Metrics: this.getMnemonics(this.model.get("Metrics")),
                Dimensions: [],
                Filters: {
                    "DateFilter": {
                        "From": start,
                        "To": end
                    }
                }
            });
            console.log(einstein);
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

        getMnemonics: function (metrics) {

            var metricMnemonics = [];

            _.each(metrics, function (metric) {
                var newMetric = new Metric(metric);
                metricMnemonics.push(newMetric.get("Mnemonic"));
            });

            return metricMnemonics;

        },


        workEinstein: function (stoneAlone) {

            var self = this;
            //            $('#spinner').loader();
            //            $("#spinner").spin("tiny");

            stoneAlone.fetch({
                url: 'http://37.157.0.42:33896/api/Einstein/Data',
                data: JSON.stringify(stoneAlone),
                contentType: 'application/json',
                dataType: 'json',
                type: 'POST',
                processData: false,
                success: function (response) {

                    self.render(response.attributes.ComponentValues, response.attributes.Filters.DateFilter);
                    console.log("Sufecintas einsteinas: ", response.attributes.ComponentValues);
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
            var routerUrl = "editComponent/".concat(id);

            Backbone.history.navigate(routerUrl, true, true);

        }


    });

    return timelineView;
});