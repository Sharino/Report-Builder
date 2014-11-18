define('ComponentView', [
    'BaseCompositeView',
    'Component',
    'DashboardComponent',
    'MetricCollection',
    'DimensionCollection',
    'MetricListView',
    'DimensionListView',
    'text!templates/component.html',
    'Config',
    'adform-notifications'
], function (BaseCompositeView, Component, DashboardComponent, MetricCollection, DimensionCollection, MetricListView, DimensionListView, componentTemplate, Config) {
    var ComponentView = BaseCompositeView.extend({
        template: _.template(componentTemplate),

        events: {
            'click #component-submit': 'submit',
            'click .radio-group': 'hide'
        },

        toggleDimensionList: function () {
            if (this.inputType() === 1) {
                this.$el.find('#dimension-list').hide();
            } else {
                this.$el.find('#dimension-list').show();
            }
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
                    self.metricView = self.renderSubview('#metric-list', new MetricListView(self.model, allMetrics));
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
                    self.dimensionView = self.renderSubview('#dimension-list', new DimensionListView(self.model, allDimensions));
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

            //TODO FIX ME
            $('#metric-list').find('.list-pop').tooltip({
                delay: {
                    show: 1000,
                    hide: 500
                },
                template: '<div class="tooltip info" style="width: 100%;"><div class="tooltip-inner"></div></div>'
            });

            return this;
        },

        submit: function () {
            this.model.set({ Title: this.inputTitle(), Type: this.inputType(), Metrics: this.metricView.inputMetrics(), Dimensions: this.dimensionView.inputDimensions() });
            console.log(this.model.toJSON());

            var validationSuccess = this.model.save({}, {
                success: function (model, response) {
                    $.notifications.display({
                        type: 'success',
                        content: 'Successfully saved!',
                        timeout: Config.NotificationSettings.Timeout
                    });
                    Backbone.history.navigate("list", { trigger: true });
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

    return ComponentView;
});
