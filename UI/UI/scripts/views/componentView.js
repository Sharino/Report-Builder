﻿define('ComponentView', [
    'BaseCompositeView',
    'Component',
    'DashboardComponent',
    'MetricCollection',
    'DimensionCollection',
    'MetricDimensionView',
    'MetricListView',
    'DimensionListView',
    'MetricDimensionMap',
    'text!templates/component.html',
    'text!templates/helpContent.html',
    'Config',
    'adform-notifications',
    'adform-side-panel'
], function (BaseCompositeView, Component, DashboardComponent, MetricCollection, DimensionCollection, metricDimensionView, MetricListView, DimensionListView, MetricDimensionMap, componentTemplate, helpContent, Config) {
    var ComponentView = BaseCompositeView.extend({
        template: _.template(componentTemplate),

        events: {
            'click #component-submit': 'submit',
            'click #component-cancel': 'cancel',
            'click .radio-group': 'toggleDimensionList',
            'click .adf-icon-small-edit': 'toggleComponentName',
            'click #component-help': 'handleHelpAction'
        },

        initialize: function () {
            MetricDimensionMap.getMap();
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

        cancel: function (e) {
            alert('Padaryk mane :*'); // WTF!?
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
        },

        toggleComponentName: function () {
            this.$el.find('#basicName').toggle();
            this.$el.find('#editName').toggle();
        },
        toggleDimensionList: function () {
            if (this.inputType() === 1) {
                this.$el.find('#dimension-list').hide();
                this.$el.find('#gr').removeClass('col-md-4').addClass('col-md-6');
                this.$el.find('#mr').removeClass('col-md-4').addClass('col-md-6');
            } else {
                this.$el.find('#gr').removeClass('col-md-6').addClass('col-md-4');
                this.$el.find('#mr').removeClass('col-md-6').addClass('col-md-4');

                this.$el.find('#dimension-list').show();
            }
            this.model.set({ Type: this.inputType() });

            var stooges = [
                    this.$el.find("#gr").height(),
                    this.$el.find("#mr").height(),
                    this.$el.find("#dr").height()
            ];

            Config.dimensionView.render();

            var max = _.max(stooges, function (stooge) { return stooge; });
            this.$el.find(".form-horizontal").height(max);
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

        handleHelpAction: function () {

            $.sidePanel({
                body: helpContent,
                header: {
                    title: "Component Creation Help"
                },
                resize: false,
                width: "650px",
                buttons: [
                    {
                        title: "Close",
                        cssClass: "btn-cancel"
                    }
                ]
            });
        }

    });

    return ComponentView;
});
