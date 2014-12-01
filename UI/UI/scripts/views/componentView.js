﻿define('ComponentView', [
    'BaseCompositeView',
    'Component',
    'DashboardComponent',
    'MetricCollection',
    'DimensionCollection',
    'MetricDimensionView',
    'MetricListView',
    'DimensionListView',
    'text!templates/component.html',
    'Config',
    'adform-notifications'
], function (BaseCompositeView, Component, DashboardComponent, MetricCollection, DimensionCollection, metricDimensionView, MetricListView, DimensionListView, componentTemplate, Config) {
    var ComponentView = BaseCompositeView.extend({
        template: _.template(componentTemplate),

        events: {
            'click #component-submit': 'submit',
            'click .radio-group': 'toggleDimensionList',
        },

        toggleDimensionList: function () {
            if (this.inputType() === 1) {
                this.$el.find('#dimension-list').hide();
            } else {
                this.$el.find('#dimension-list').show();
            }
            this.model.set({ Type: this.inputType() });

            Config.dimensionView.render();
        },
        inputTitle: function () {
            return $('#input').val();
        },

        inputType: function () {
            var selected = this.$el.find("input:radio[name=type-options]:checked").val();
            if (selected != undefined) {
                return parseInt(selected);
            } else {
                return 0;
            }
        },

        render: function () {
            $('#component').loader();

            var allMetrics = new MetricCollection();
            var allDimensions = new DimensionCollection();

            var self = this;

            _.defer(function () {
                $("#metric-list").loader();
                $("#dimension-list").loader();
            });

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

        submit: function () {
            if (this.inputType() == 1) {
                this.model.set({ Title: this.inputTitle(), Type: this.inputType(), Metrics: this.metricView.inputMetrics(), Dimensions: [] });
            }
            else {
                this.model.set({ Title: this.inputTitle(), Type: this.inputType(), Metrics: this.metricView.inputMetrics(), Dimensions: this.dimensionView.inputDimensions() });
            }

            var validationSuccess = this.model.save({}, {
                success: function () {
                    $.notifications.display({
                        type: 'success',
                        content: 'Successfully saved!',
                        timeout: Config.NotificationSettings.Timeout
                    });
                    Backbone.history.navigate("list", { trigger: true });
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
                },
                timeout: Config.NetworkSettings.Timeout
            });

            if (!validationSuccess) {
                if (this.model.validationError) {
                    this.model.validationError.forEach(function (error) {
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

    return ComponentView;
});
