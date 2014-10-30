define('DashboardComponentView', [
    'BaseCompositeView',
    'DashboardComponent',
    'MetricCollection',
    'MetricListView',
    'text!templates/dashboardComponent.html',
    'Config',
    'adform-notifications'
], function (BaseCompositeView, DashboardComponent, MetricCollection, MetricListView, dashboardComponentTemplate, Config) {
    var DashboardComponentView = BaseCompositeView.extend({
        template: _.template(dashboardComponentTemplate),


        inputTitle: function() {
            return $('#input').val();
        },

        initialize: function() {
            this.submitEvent.bind('submitEvent', this.submit, this);
        },

        inputType: function() {
            var selected = $("input:radio[name=type-options]:checked").val();
            if (selected != undefined) {
                return parseInt(selected);
            } else {
                return 0;
            }
        },

        inputMetrics: function() {
            var result = [];

            this.subViews[0].metricArray.forEach(function(metric) {
                if (!metric.Placeholder) {
                    result.push(metric);
                }
            });

            return result;
        },

        render: function() {
            var templVariables = {
                "data": {
                    "viewTitle": "",
                    "activeNew": "",
                    "activeList": ""
                }
            };

            var allMetrics = new MetricCollection();

            var self = this;

            if (this.model) {
                templVariables["data"]["model"] = this.model.toJSON();
                this.$el.html(this.template(templVariables));

                allMetrics.fetch({
                    success: function(allMetrics, response) {
                        console.log("allMetric.fetch OK", allMetrics, response);

                        self.renderSubview('#metric-list', new MetricListView(self.model, allMetrics));
                    },
                    error: function(allMetrics, response) {
                        console.log("allMetric.fetch FAIL", allMetrics, response);
                    }
                });

                this.$el.find("#rb" + this.model.get("Type")).prop("checked", true);
                return this;
            }

            return this;
        },

        submit: function() {
            this.model.set({ Title: this.inputTitle(), Type: this.inputType(), Metrics: this.inputMetrics() });
            console.log(this.model.toJSON());

            var def = JSON.stringify({Metrics: this.model.get("Metrics"), Dimensions: this.model.get("Dimensions"), Filters: this.model.get("Filters")});

            this.model.set("Definition", def);

            var validationSuccess = this.model.save({}, {
                success: function (model, response) {
                    console.log("Save OK", model, response);

                    $.notifications.display({
                        type: 'success',
                        content: 'Successfully saved!',
                        timeout: Config.NotificationSettings.Timeout
                    });


                    Backbone.history.loadUrl(Backbone.history.fragment);
                },
                error: function (model, response) {
                    console.log("Save FAIL", model, response);

                    if (response.responseJSON) {
                        response.responseJSON.forEach(function (error) {
                            $.notifications.display({
                                type: 'error',
                                content: error.Message,
                                timeout: Config.NotificationSettings.Timeout
                            });
                        });
                    } else {
                        if (response.statusText) {
                            $.notifications.display({
                                type: 'error',
                                content: response.statusText,
                                timeout: Config.NotificationSettings.Timeout
                            });
                        } else {
                            $.notifications.display({
                                type: 'error',
                                content: Config.ErrorSettings.ErrorMessages.NoResponse,
                                timeout: Config.NotificationSettings.Timeout
                            });
                        }
                    }
                },
                timeout: Config.NetworkSettings.Timeout
            });

            if (!validationSuccess) {
                console.log("Validation failed!", this.model.errors);

                if (this.model.errors) {
                    this.model.errors.forEach(function (error) {
                        $.notifications.display({
                            type: 'error',
                            content: error.message,
                            timeout: Config.NotificationSettings.Timeout
                        });
                    });
                }
            }
            return false;
        }
    });

    return DashboardComponentView;
});
