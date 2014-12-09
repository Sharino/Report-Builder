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
            'click .csv': 'csv',
            'click .pdf': 'pdf',
            'click .xls': 'xls',
        },

        initialize: function (parent, pos, origin, dateview) {
            this.origin = origin;
            this.dateView = dateview;
            this.model = parent;
            this.position = pos;
        },

        render: function () {
            var einstein = new Einstein({ Model: this.model.toJSON(), Start: this.dateView.datePicker.getSelectedDate(), End: this.dateView.datePicker2.getSelectedDate() });

            var self = this;

            einstein.save({}, {
                success: function(response) {
                    self.$el.html(self.template({
                        Einstein: response.toJSON().ComponentValues[0],
                        Metrics: self.model.get('Metrics'),
                        model: self.model.toJSON(),
                        Position: self.position || 0,
                        ComponentID: self.model.id
                    }));

                    self.renderSubview("#component-buttons", new ComponentButtonView(self.position + 1, self.model, self.origin));//TODO: Hack. Int 0 is interpreted as an empty object in subviews constructor
            
                    return self;
                },
                error: function() {
                    console.log("fail");
                }
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