define('ComponentView', [
    'jquery',
    'underscore',
    'backbone',
    'Component',
    'MetricCollection',
    'MetricListView',
    'text!templates/component.html',
    'adform-notifications',
    'Config'
], function ($, _, Backbone, Component, MetricCollection, MetricListView, componentTemplate, AdformNotification, Config) {
    var ComponentView;

    ComponentView = Backbone.View.extend({
        template: _.template(componentTemplate),

        /* ComponentView events */
        events: {
            'click #component-submit': 'submit'         // Submit button click calls this.submit()
        },

        /* Initializing basic properties */
        initialize: function () {
            this.childViews = [];                       // Create empty array of childViews for easy access
        },

        /* Form input title return method.
        Returns: string */
        inputTitle: function () {
            return $('#input').val();
        },

        /* Form input type return method.
        Returns: int */
        inputType: function () {
            var selected = $("input:radio[name=type-options]:checked").val();
            if (selected != undefined) {
                return parseInt(selected);
            } else {
                return 0;
            }
        },

        /* Form input metrics return method.
        Returns: Metric[] */
        inputMetrics: function () {
            return this.childViews[0].collection.toJSON();
        },

        /* Render method. Renders ComponentView to screen. */
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
            
            /* DOM is Ready.*/
           
            var self = this;
            _(function () {
                $("#rb" + self.model.get("Type")).prop("checked", true);
                var adfSelectReference3 = new AdformSelect($('select.adf-select1'), { adjustDropperWidth: true, search: true, footer: true, width: 'container' });
            }).defer();
            return this;
        },

        /* Form Submit method.
        Takes required data from the form.
        Validates it, tries to save it, acts accordingly.
        Returns nothing. */
        submit: function () {
            this.model.set({ Title: this.inputTitle(), Type: this.inputType(), Metrics: this.inputMetrics() });
            console.log(this.model.toJSON());
            
            // var which gets false on Validation error during .save()
            var validationSuccess = this.model.save({}, {
                // Success callback. NOTE: model and response SHOULD be taken.
                success: function (model, response) {       // If FrontEnd Validation pass and API responds with OK.
                    console.log("Save OK", model, response);

                    AdformNotification.display({            
                        type: 'success',
                        content: 'Successfully saved!',
                        timeout: Config.NotificationSettings.Timeout
                    });
                    //this.model = new Component(); // #WTF? Seems like it's not really needed here. Let's keep it for a while in case sth happens.
                    Backbone.history.navigate("list", { trigger: true }); // Navigate user to list, triggering list events (fetch).
                },
                // Error callback. NOTE: model and response SHOULD be taken.
                error: function (model, response) {         // If FrontEnd Validation passed, but server responds with failure.
                    console.log("Save FAIL", model, response);

                    if (response.responseJSON) {
                        // For each error message entry from API display notification message.
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
             
            if (!validationSuccess) {   // FrontEnd Validation FAILED.
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
        },

        /* Assign Child View.
        Takes selector and view array.
        Pushes View references to ChildView[] and renders them.
        Returns nothing. */
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
