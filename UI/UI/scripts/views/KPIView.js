define('KPIView', [
   'BaseCompositeView',
   'text!templates/kpi.html',
   'DateFilterView',
   'Einstein',
   'Metric',
   'Config',
   'Export',
   'ComponentButtonView',
   'spin',
   'adform-loader',
   'adform-notifications'
], function (BaseCompositeView, KPITemplate, DateFilterView, Einstein, Metric, Config, Export, ComponentButtonView) {
    var kpiView = BaseCompositeView.extend({
        template: _.template(KPITemplate),

        events: {
            'click #generateByDate': 'generateNewData',
            'click .csv': 'csv',
            'click .pdf': 'pdf',
            'click .xls': 'xls',
        },

        initialize: function (parent, pos, origin) {
            this.origin = origin;
            this.model = parent;
            this.position = pos;
            this.startDate = moment().format('YYYY-MM-DD');
            this.initEinstein(this.startDate, this.startDate);
        },

        render: function (einstein, dataFiler) {
            var from, to;

            if (!einstein && !dataFiler) {
                einstein = 'garbage';
                from = moment().subtract('days', 7).format('YYYY-MM-DD');
                to = moment().subtract('days', 1).format('YYYY-MM-DD');
            }
            else {
                if (this.origin === "preview") {
                    from = moment().subtract('days', 7).format('YYYY-MM-DD');
                    to = moment().subtract('days', 1).format('YYYY-MM-DD');
                } else {
                    from = $("#picker").find("input")[0].value;
                    to = $("#picker2").find("input")[0].value;
                }
            }

            this.$el.html(this.template({
                Einstein: einstein,
                Metrics: this.model.get('Metrics'),
                model: this.model.toJSON(),
                Position: this.position || 0,
                ComponentID: this.model.id
            }));

            if (this.origin !== "preview") {
                this.renderSubview("#date-filter", new DateFilterView({
                    from: from,
                    to: to
                }));
            }

            this.renderSubview("#component-buttons", new ComponentButtonView(this.position + 1, this.model, this.origin));

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

            stoneAlone.fetch({
                url: Config.EinsteinSettings.URL,
                data: JSON.stringify(stoneAlone),
                contentType: 'application/json',
                dataType: 'json',
                type: 'POST',
                processData: false,
                success: function (response) {
                    self.einsteinData = response;
                    self.render(response.attributes.ComponentValues[0], response.attributes.Filters.DateFilter);
                },
            });
        },

        csv: function (e) {
            e.preventDefault();
            var compValues = this.einsteinData.get('ComponentValues')[0].MetricValues;

            var request = {
                Title: this.model.get("Title"),
                Values: compValues,
                StartDate: $("#picker").find("input")[0].value,
                EndDate: $("#picker2").find("input")[0].value,
                GeneratedDate: moment().format('YYYY-MM-DD hh:mm:ss a')
            };

            Export.exportCsv(request, {
                success: function (data, status, jqXHR) {
                    window.location.assign(data);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $.notifications.display({
                        type: 'error',
                        content: "Unable to export component data.", // TODO Move to config for multilanguage later
                        timeout: Config.NotificationSettings.Timeout
                    });
                }
            });
        },

        pdf: function (e) {
            e.preventDefault();
            var compValues = this.einsteinData.get('ComponentValues')[0].MetricValues;

            var request = {
                Title: this.model.get("Title"),
                Values: compValues,
                StartDate: $("#picker").find("input")[0].value,
                EndDate: $("#picker2").find("input")[0].value,
                GeneratedDate: moment().format('YYYY-MM-DD hh:mm:ss a')
            };

            Export.exportPdf(request, {
                success: function (data, status, jqXHR) {
                    window.location.assign(data);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $.notifications.display({
                        type: 'error',
                        content: "Unable to export component data.", // TODO Move to config for multilanguage later
                        timeout: Config.NotificationSettings.Timeout
                    });
                }
            });
        },

        xls: function (e) {
            e.preventDefault();
            var compValues = this.einsteinData.get('ComponentValues')[0].MetricValues;

            var request = {
                Title: this.model.get("Title"),
                Values: compValues,
                StartDate: $("#picker").find("input")[0].value,
                EndDate: $("#picker2").find("input")[0].value,
                GeneratedDate: moment().format('YYYY-MM-DD hh:mm:ss a')
            };

            Export.exportXls(request, {
                success: function (data, status, jqXHR) {
                    window.location.assign(data);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $.notifications.display({
                        type: 'error',
                        content: "Unable to export component data.", // TODO Move to config for multilanguage later
                        timeout: Config.NotificationSettings.Timeout
                    });
                }
            });
        }
    });

    return kpiView;
});