﻿define('KPIView', [
   'BaseCompositeView',
   'text!templates/kpi.html',
   'DateFilterView',
   'Einstein',
   'Metric',
   'spin',
   'adform-loader'
], function (BaseCompositeView, KPITemplate, DateFilterView, Einstein, Metric) {

    var startDate = moment().format('YYYY-MM-DD');

    var kpiView = BaseCompositeView.extend({
        template: _.template(KPITemplate),

        events: {
            'click #generateByDate': 'generateNewData',
            'click .KpiEdit': 'edit'
        },

        initialize: function (parent, pos) {
            this.model = parent;
            this.position = pos;
            this.initEinstein(startDate, startDate);
        },

        render: function (einstein, dataFiler) {
            var from, to;
>>>>>>> origin/master

            if (!einstein && !dataFiler) {
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
                ComponentID: this.model.id
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
            console.log('eins');
            console.log(einstein);
            this.workEinstein(einstein);

        },

        generateNewData: function () {

            var startDate = $("#picker").find("input")[0].value;
            var endDate = $("#picker2").find("input")[0].value;

            if (startDate <= endDate) {
                this.initEinstein(startDate, endDate);
            } else {
                $.notifications.display({
                    type: 'error',
                    content: "End Date is earlier than Start Date.",
                    timeout: Config.NotificationSettings.Timeout
                });
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
            console.log("asdasd");
            console.log(stoneAlone);
            stoneAlone.fetch({
                url: 'http://37.157.0.42:33896/api/Einstein/Data',
                data: JSON.stringify(stoneAlone),
                contentType: 'application/json',
                dataType: 'json',
                type: 'POST',
                processData: false,
                success: function (response) {

                    self.render(response.attributes.ComponentValues[0], response.attributes.Filters.DateFilter);

                },
                error: function (error) {
                    console.log("Stone Alone FAIL", error);
                }
            });
        },
        edit: function (e) {

            e.preventDefault();

            var id = $(e.currentTarget).attr("id");
            var routerUrl = "create/".concat(id);

            Backbone.history.navigate(routerUrl, true, true);

        }


    });

    return kpiView;
});