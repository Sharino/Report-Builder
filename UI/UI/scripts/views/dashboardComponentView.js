define('DashboardComponentView', [
    'BaseCompositeView',
    'DashboardComponent',
    'MetricCollection',
    'DimensionCollection',
    'MetricListView',
    'DimensionListView',
    'MetricDimensionMap',
    'text!templates/dashboardComponent.html',
    'Config',
    'adform-notifications'
], function (BaseCompositeView, DashboardComponent, MetricCollection, DimensionCollection, MetricListView, DimensionListView, MetricDimensionMap, dashboardComponentTemplate, Config) {
    var DashboardComponentView = BaseCompositeView.extend({
        template: _.template(dashboardComponentTemplate),

        events: {
            'click .radio-group': 'toggleDimensionList',
        },

        initialize: function () {
            this.submitEvent.bind('submitEvent', this.submit, this);
            MetricDimensionMap.getMap();
        },

        toggleDimensionList: function () {
            if (this.$el.find('#rb1').is(":checked")) {
                $('#dimension-list').hide();
            } else {
                $('#dimension-list').show();
            }
            this.model.set({ Type: this.inputType() });
            Config.dimensionView.render();
        },

        inputTitle: function () {
            return $('#input').val();
        },

        inputType: function () {
            var selected = $("input:radio[name=type-options]:checked").val();
            if (selected != undefined) {
                return parseInt(selected);
            } else {
                return 0;
            }
        },

        render: function () {

            var allMetrics = new MetricCollection();
            var allDimensions = new DimensionCollection();

            var self = this;

            this.$el.html(this.template({ model: this.model.toJSON() }));
            this.$el.find("#rb" + this.model.get("Type")).prop("checked", true);

            allMetrics.fetch({
                success: function (allMetrics) {
                    self.allMetrics = allMetrics;
                    self.metricView = self.renderSubview('#metric-list', new MetricListView(self.model, self.allMetrics));
                },
                error: function (allMetrics, response) {
                    $.notifications.display({
                        type: 'error',
                        content: response.statusText,
                        timeout: Config.NotificationSettings.Timeout
                    });
                }
            });

            allDimensions.fetch({
                success: function (allDimensions) {
                    self.allDimensions = allDimensions;
                    self.dimensionView = self.renderSubview('#dimension-list', new DimensionListView(self.model, self.allDimensions));
                    self.toggleDimensionList();
                },
                error: function (allDimensions, response) {
                    $.notifications.display({
                        type: 'error',
                        content: response.statusText,
                        timeout: Config.NotificationSettings.Timeout
                    });
                }
            });
            return this;
        },

        submit: function (callbacks) {
            if (this.inputType() == 1) {
                this.model.set({ Title: this.inputTitle(), Type: this.inputType(), Metrics: this.metricView.inputMetrics(), Dimensions: [] });
            }
            else {
                this.model.set({ Title: this.inputTitle(), Type: this.inputType(), Metrics: this.metricView.inputMetrics(), Dimensions: this.dimensionView.inputDimensions() });
            }

            var definition = JSON.stringify({
                Metrics: this.model.get("Metrics"),
                Dimensions: this.model.get("Dimensions"),
                Filters: this.model.get("Filters")
            });

            this.model.set({ Definition: definition });

            var validationSuccess = this.model.save({}, {
                success: function () {
                    $.notifications.display({
                        type: 'success',
                        content: 'Successfully saved!',
                        timeout: Config.NotificationSettings.Timeout
                    });

                    if ($.isFunction(callbacks.success)) {
                        callbacks.success();
                    }
                },
                error: function (model, response) {
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

                    if ($.isFunction(callbacks.error)) {
                        callbacks.error();
                    }
                },
                timeout: Config.NetworkSettings.Timeout
            });

            if (!validationSuccess) {
                if (this.model.validationError) {
                    this.model.validationError.forEach(function(error) {
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

        beforeClose: function () {
            this.submitEvent.unbind();
        }
    });

    return DashboardComponentView;
});
