﻿define('ComponentView', [
    'BaseCompositeView',
    'Component',
    'MetricCollection',
    'MetricListView',
    'text!templates/component.html',
    'Config',
    'adform-notifications'
], function (BaseCompositeView, Component, MetricCollection, MetricListView, componentTemplate, Config) {
    var ComponentView = BaseCompositeView.extend({
        template: _.template(componentTemplate),

        events: {
            'click #component-submit': 'submit'         
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
    
        inputMetrics: function () {
            var result = [];

            this.subViews[0].metricArray.forEach(function (metric) {
                if (!metric.Placeholder) {
                    result.push(metric);
                }
            });

            return result;
        },

        render: function () {
            // TODO: CREATE SEPARATE VIEWS INSTEAD OF THIS STUFF!!!
            var templVariables = {
                "data": {
                    "viewTitle": "",
                    "activeNew": "",
                    "activeList": ""
                }
            };

<<<<<<< HEAD
            var radioSelector = 1;

            if (this.model) {       // Model exists
=======
            var allMetrics = new MetricCollection();

            var self = this;

            if (this.model) {       
>>>>>>> origin/MetricComponent
                if (this.model.isNew()) {
                    templVariables["data"]["viewTitle"] = "Create a New Component";
                    templVariables["data"]["activeNew"] = 'class="active"';
                    templVariables["data"]["activeList"] = '';
                    radioSelector = 1;
                    console.log(radioSelector);
                } else {
                    templVariables["data"]["viewTitle"] = "Edit";
                    templVariables["data"]["activeNew"] = '';
                    templVariables["data"]["activeList"] = '';
                    radioSelector = this.model.get("Type");
                    console.log(radioSelector);
                }
                templVariables["data"]["model"] = this.model.toJSON();
                this.$el.html(this.template(templVariables));

                allMetrics.fetch({
                    success: function (allMetrics, response) {
                        console.log("allMetric.fetch OK", allMetrics, response);
                        self.renderSubview('#metric-list', new MetricListView(self.model, allMetrics));
                    },
                    error: function (allMetrics, response) {
                        console.log("allMetric.fetch FAIL", allMetrics, response);
                    }
                });
                
            }
            else {                  
                templVariables["data"]["viewTitle"] = "Create a New Component";
                templVariables["data"]["activeNew"] = 'class="active"';
                templVariables["data"]["activeList"] = '';
                templVariables["data"]["model"] = [];
                radioSelector = 1;
                console.log(radioSelector);
                this.$el.html(this.template(templVariables));

                allMetrics.fetch({
                    success: function (allMetrics, response) {
                        console.log("allMetric.fetch OK", allMetrics, response);
                        self.renderSubview('#metric-list', new MetricListView(null, allMetrics));
                    },
                    error: function (allMetrics, response) {
                        console.log("allMetric.fetch FAIL", allMetrics, response);
                    }
                });
            }

<<<<<<< HEAD
            this.assign({
                '#metric-list': new MetricListView
            });

            console.log('input[name=type-options][value=' + radioSelector + ']');
            $('input[name=type-options][value=' + radioSelector + ']').prop('checked', true);
=======
            this.$el.find("#rb" + this.model.get("Type")).prop("checked", true);

>>>>>>> origin/MetricComponent
            return this;
        },

     
        submit: function () {
<<<<<<< HEAD
            this.model.set({
                Title: this.inputTitle(),
                Type: this.inputType(),
                Metrics: new MetricCollection([
                    {
                        DisplayName: "Fug XD"
                    },
                    {
                        DisplayName: "Fug XD"
                    },
                    {
                        DisplayName: "Fug XD"
                    },
                ])
            });
=======
            this.model.set({ Title: this.inputTitle(), Type: this.inputType(), Metrics: this.inputMetrics() });
>>>>>>> origin/MetricComponent
            console.log(this.model.toJSON());
            
            var validationSuccess = this.model.save({}, {
                success: function (model, response) {      
                    console.log("Save OK", model, response);

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
                    }
                    else {
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

    return ComponentView;
});
