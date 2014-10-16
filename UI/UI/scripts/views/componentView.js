define('ComponentView', [
    'jquery',
    'underscore',
    'backbone',
    'BaseCompositeView',
    'Component',
    'MetricCollection',
    'MetricListView',
    'text!templates/component.html',
    'adform-notifications',
    'Config'
], function ($, _, Backbone, BaseCompositeView ,Component, MetricCollection, MetricListView, componentTemplate, AdformNotification, Config) {
    var ComponentView;

    ComponentView = BaseCompositeView.extend({
        template: _.template(componentTemplate),

        events: {
            'click #component-submit': 'submit'         
        },

        initialize: function () {
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

                
            }
            else {                  
                templVariables["data"]["viewTitle"] = "Create a New Component";
                templVariables["data"]["activeNew"] = 'class="active"';
                templVariables["data"]["activeList"] = '';
                templVariables["data"]["model"] = [];
                this.$el.html(this.template(templVariables));
            }
            
            var allMetrics = new MetricCollection();

            var self = this;

            allMetrics.fetch({
                success: function (allMetrics, response) {
                    console.log("allMetric.fetch OK", allMetrics, response);
                    self.renderSubview('#metric-list', new MetricListView(self.model, allMetrics));
                },
                error: function (allMetrics, response) {
                    console.log("allMetric.fetch FAIL", allMetrics, response);
                }
            });


            this.$el.find("#rb" + this.model.get("Type")).prop("checked", true);

            return this;
        },

     
        submit: function () {
            this.model.set({ Title: this.inputTitle(), Type: this.inputType(), Metrics: this.inputMetrics() });
            console.log(this.model.toJSON());
            
            var validationSuccess = this.model.save({}, {
                success: function (model, response) {      
                    console.log("Save OK", model, response);

                    AdformNotification.display({            
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
                            AdformNotification.display({
                                type: 'error',
                                content: error.Message,
                                timeout: Config.NotificationSettings.Timeout
                            });
                        });
                    }
                    else {
                        if (response.statusText) {
                            AdformNotification.display({
                                type: 'error',
                                content: response.statusText,
                                timeout: Config.NotificationSettings.Timeout
                            });
                        } else {
                            AdformNotification.display({
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
                        AdformNotification.display({
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
