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
        },

        render: function (einstein, dataFiler) {
            var einstein = new Einstein({Model: this.model.toJSON(), Start: new Date(), End: new Date()});

            var from, to;

            if (!einstein && !dataFiler) {
                einstein = 'garbage';
                from = this.startDate;
                to = this.startDate;
            }
            else {
                if (this.origin === "preview") {
                    from = this.startDate;
                    to = moment().add('days', 7).format('YYYY-MM-DD');
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