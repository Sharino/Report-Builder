define('DashboardComponentView', [
    'BaseCompositeView',
    'DashboardComponent',
    'MetricCollection',
    'DimensionCollection',
    'MetricListView',
    'DimensionListView',
    'text!templates/dashboardComponent.html',
    'Config',
    'adform-notifications'
], function (BaseCompositeView, DashboardComponent, MetricCollection, DimensionCollection, MetricListView, DimensionListView, dashboardComponentTemplate, Config) {
    var DashboardComponentView = BaseCompositeView.extend({
        template: _.template(dashboardComponentTemplate),

        events: {
            'click .radio-group': 'hide'
        },

        hide: function () {
            if (this.$el.find('#rb1').is(":checked")) {
                $('#dimension-list').hide();
            } else {
                $('#dimension-list').show();
            }
        },

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

            this.metricView.metricArray.forEach(function(metric) {
                if (!metric.Placeholder) {
                    result.push(metric);
                }
            });

            return result;
        },

        inputDimensions: function () {
            var result = [];

            this.dimensionView.dimensionArray.forEach(function (dimension) {
                if (!dimension.Placeholder) {
                    result.push(dimension);
                }
            });

            return result;
        },

        render: function() {

            var allMetrics = new MetricCollection();
            var allDimensions = new DimensionCollection();


            var self = this;

            if (this.model) {
                this.$el.html(this.template({ model: this.model }));

                allMetrics.fetch({
                    success: function(allMetrics, response) {
                        self.metricView = self.renderSubview('#metric-list', new MetricListView(self.model, allMetrics));
                    },
                    error: function(allMetrics, response) {
                        console.log("allMetric.fetch FAIL", allMetrics, response);
                    }
                });

                allDimensions.fetch({
                    success: function (allDimensions, response) {
                        self.dimensionView = self.renderSubview('#dimension-list', new DimensionListView(self.model, allDimensions));
                    },
                    error: function (allDimensions, response) {
                        console.log("allDimensions.fetch FAIL", allDimensions, response);
                    }
                });

                this.$el.find("#rb" + this.model.get("Type")).prop("checked", true);

                this.$el.find('#dimension-list').hide();

                return this;
            }

            return this;
        },

        submit: function() {
            this.model.set({ Title: this.inputTitle(), Type: this.inputType(), Metrics: this.inputMetrics(), Dimensions: this.inputDimensions() });
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
        },

        beforeClose: function(){
            this.submitEvent.unbind();
        }
    });

    return DashboardComponentView;
});
