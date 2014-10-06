define('ComponentView', [
    'jquery',
    'underscore',
    'backbone',
    'Component',
    'MetricCollection',
    'MetricListView',
    'text!templates/component.html',
    'adform-notifications'
], function ($, _, Backbone, Component, MetricCollection, MetricListView, componentTemplate, AdformNotification) {
    var ComponentView;

    ComponentView = Backbone.View.extend({
        template: _.template(componentTemplate),

        events: {
            'click #component-submit': 'submit',
        },

        initialize: function () {
            //console.log("componentView.childViews", this.childViews);
            this.childViews = [];       // Store child views for easy closing.
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
            var templVariables = {
                "data": {
                    "viewTitle": "",
                    "activeNew": "",
                    "activeList": ""
                }
            };

            if (this.model) {       // Model exists
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
                //console.log(templVariables);

                this.$el.html(this.template(templVariables));
            }
            else {                  // Model does not exist
                templVariables["data"]["viewTitle"] = "Create a New Component";
                templVariables["data"]["activeNew"] = 'class="active"';
                templVariables["data"]["activeList"] = '';
                templVariables["data"]["model"] = [];
                this.$el.html(this.template(templVariables));
            }

            this.assign({
                '#metric-list': new MetricListView
            });
            
            return this;
        },

        submit: function () {
            this.model.set({ Title: this.inputTitle(), Type: this.inputType() });
            console.log(this.model.toJSON());
            
            // var which gets false on Validation error during .save()
            var validationSuccess = this.model.save({}, {
                // Success callback. NOTE: model and response SHOULD be taken.
                success: function (model, response) {       // If validation pass and server responds with OK.
                    console.log("Save OK", model);

                    AdformNotification.display({            // Show Adform notification. See AformNotification(adform-notifications) dependency.
                        type: 'success',
                        content: 'Successfully saved!',
                        timeout: 5000
                    });
                    this.model = new Component();
                    Backbone.history.navigate("list", { trigger: true }); // Navigate user to list, triggering list events (fetch).
                },
                // Error callback. NOTE: model and response SHOULD be taken.
                error: function (model, response) {         // If validation pass, but server responds with failure.
                    console.log("Save FAIL", response);

                    // For each error message entry display notification with message.
                    response.responseJSON.forEach(function(entry){
                        AdformNotification.display({       // Show Adform notification.
                            type: 'error',
                            content: entry.Message,         // Shows message from server
                            timeout: 5000
                        });
                    });
                }
            });
            // Deeper validation error check.
            if (!validationSuccess) {   // If save returns false we can check what went wrong.
                console.log("Validation failed!");

                AdformNotification.display({                // And show notifications.
                    type: 'error',
                    content: 'Validation failed!',
                    timeout: 5000
                });
            }
            return false;
        },

        assign: function (selector, view) {
            var selectors;
            if (_.isObject(selector)) {
                selectors = selector;
            }
            else {
                selectors = {};
                selectors[selector] = view;
            }
            if (!selectors) return;
            _.each(selectors, function (view, selector) {
                this.childViews.push(view);
                view.setElement(this.$(selector)).render();
            }, this);
            //console.log("componentView.assign this.childViews", this.childViews);

        }
           
    });

    return ComponentView;
});
