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
            'click .radio-group': 'toggleDimensionList',
        },

        toggleDimensionList: function () {
            if (this.$el.find('#rb1').is(":checked")) {
                $('#dimension-list').hide();
            } else {
                $('#dimension-list').show();
            }
        },

        initialize: function () {
            this.submitEvent.bind('submitEvent', this.submit, this);
        },

        inputTitle: function() {
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

        render: function() {

            var allMetrics = new MetricCollection();
            var allDimensions = new DimensionCollection();

            var self = this;

            this.$el.html(this.template({ model: this.model.toJSON() }));
            this.$el.find("#rb" + this.model.get("Type")).prop("checked", true);

            allMetrics.fetch({
                success: function (allMetrics) {
                    self.allMetrics = allMetrics;
                    console.log($("#metric-list"));
                    self.metricView = self.renderSubview('#metric-list', new MetricListView(self.model, self.allMetrics));
                    self.metricViewDone = true;
                    self.await();
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
                    self.dimensionViewDone = true;
                    self.await();
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

        await: function () {
            var self = this;
            if (self.metricViewDone == true && self.dimensionViewDone == true) {
                self.toggleDimensionList();
                self.metricView.sibling = self.dimensionView;
                self.dimensionView.sibling = self.metricView;
            }
        },

        submit: function() {
            this.model.set({ Title: this.inputTitle(), Type: this.inputType(), Metrics: this.metricView.inputMetrics(), Dimensions: this.dimensionView.inputDimensions() });

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
