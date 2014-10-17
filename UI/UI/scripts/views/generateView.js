define('GenerateView', [
    'BaseCompositeView',
    'Component',
    'MetricCollection',
    'MetricListView',
    'ComponentGeneratedView',
    'text!templates/generate.html',
    'adform-notifications'
], function (BaseCompositeView, Component, MetricCollection, MetricListView, ComponentGeneratedView, generateTemplate) {
    var GenerateView = BaseCompositeView.extend({
        template: _.template(generateTemplate),

        events: {
            'click #generate-submit': 'submit',
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

            this.renderSubview('#component-by-type', new ComponentGeneratedView(this.model));

            //this.assign({
            //    '#component-by-type': new ComponentGeneratedView({
            //        model: this.model,
            //        collection: this.model.get("Metrics")
            //    })
            //});
            
            return this;
        },

        submit: function () {
            console.log(this.model.toJSON());
            return false;
        }
    });

    return GenerateView;
});
