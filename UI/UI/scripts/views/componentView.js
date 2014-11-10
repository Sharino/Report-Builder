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
        },

        inputTitle: function () {
            return $('#input').val();
        },

        inputType: function() {
            var selected = $("input:radio[name=type-options]:checked").val();
            if (selected != undefined) {
                return parseInt(selected);
            } else {
                return 0;
            }
        },

        /* TODO: Should move validation to MetricListView */
        inputMetrics: function() {
            var result = [];

            this.metricView.metricArray.forEach(function (metric) {
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
            // TODO: CREATE SEPARATE VIEWS INSTEAD OF THIS STUFF!!!
            var templVariables = {
                "data": {
                    "viewTitle": "",
                    "activeNew": "",
                    "activeList": ""
                }
            };

            var allMetrics = new MetricCollection();
            var allDimensions = new DimensionCollection();

            var self = this;

            if (this.model) {
                if (this.model.isNew()) {
                    templVariables["data"]["viewTitle"] = "Create a New Component";
                    templVariables["data"]["activeNew"] = 'class="active"';
                    templVariables["data"]["activeList"] = '';
                } else {
                    templVariables["data"]["viewTitle"] = "Edit";
                    templVariables["data"]["activeNew"] = '';
                    templVariables["data"]["activeList"] = '';
                }
                templVariables["data"]["model"] = this.model.toJSON();
                this.$el.html(this.template(templVariables));

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

            } else {
                templVariables["data"]["viewTitle"] = "Create a New Component";
                templVariables["data"]["activeNew"] = 'class="active"';
                templVariables["data"]["activeList"] = '';
                templVariables["data"]["model"] = [];
                this.$el.html(this.template(templVariables));

                allMetrics.fetch({
                    success: function (allMetrics) {
                        self.metricView = self.renderSubview('#metric-list', new MetricListView(self.model, allMetrics));
                    },
                    error: function (allMetrics, response) {
                        console.log("allMetric.fetch FAIL", allMetrics, response);
                    }
                });

                allDimensions.fetch({
                    success: function (allDimensions, response) {
                        self.renderSubview('#dimension-list', new DimensionListView(self.model, allDimensions));
                    },
                    error: function (allDimensions, response) {
                        console.log("allDimensions.fetch FAIL", allDimensions, response);
                    }
                });
            }

            setTimeout(function() {
                console.log("awdawdawdawdawd", $('#metric-list').find('.list-pop'));

                $('#metric-list').find('.list-pop').tooltip({
                    delay: {
                        show: 1000,
                        hide: 500
                    },
                    template: '<div class="tooltip info" style="width: 100%;"><div class="tooltip-inner"></div></div>'
                });
            }, 3000);

            this.$el.find("#rb" + this.model.get("Type")).prop("checked", true);

            return this;
        },

        submit: function() {
            this.model.set({ Title: this.inputTitle(), Type: this.inputType(), Metrics: this.inputMetrics(), Dimensions: this.inputDimensions() });
            console.log(this.model.toJSON());

            var validationSuccess = this.model.save({}, {
                success: function(model, response) {
                    console.log("Save OK", model, response);

                    $.notifications.display({
                        type: 'success',
                        content: 'Successfully saved!',
                        timeout: Config.NotificationSettings.Timeout
                    });
                    Backbone.history.navigate("list", { trigger: true });
                },
                error: function(model, response) {
                    console.log("Save FAIL", model, response);

                    if (response.responseJSON) {
                        response.responseJSON.forEach(function(error) {
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
                    this.model.errors.forEach(function(error) {
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
