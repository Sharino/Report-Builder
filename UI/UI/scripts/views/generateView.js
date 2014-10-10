define('GenerateView', [
    'jquery',
    'underscore',
    'backbone',
    'Component',
    'MetricCollection',
    'MetricListView',
    'ComponentGeneratedView',
    'text!templates/generate.html',
    'adform-notifications'
], function ($, _, Backbone, Component, MetricCollection, MetricListView,
             ComponentGeneratedView, generateTemplate, AdformNotification) {
    var GenerateView;

    GenerateView = Backbone.View.extend({
        template: _.template(generateTemplate),

        events: {
            'click #generate-submit': 'submit',
        },

        initialize: function () {
            //console.log("componentView.childViews", this.childViews);
            this.childViews = [];       // Store child views for easy closing.
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
                '#component-by-type': new ComponentGeneratedView({
                    model: this.model,
                    collection: this.model.get("Metrics")
                })
            });
            
            return this;
        },

        submit: function () {
            console.log(this.model.toJSON());
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

    return GenerateView;
});
