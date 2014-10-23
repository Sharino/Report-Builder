define('DashboardView', [
    'BaseCompositeView',
    'DashboardComponent',
    'ComponentGeneratedView',
    'MetricCollection',
    'MetricListView',
    'text!templates/dashboard.html',
    'Config',
    'adform-notifications'
], function (BaseCompositeView, DashboardComponent, ComponentGeneratedView, MetricCollection, MetricListView, dashboardTemplate, Config) {
    var DashboardView = BaseCompositeView.extend({
        template: _.template(dashboardTemplate),

        events: {
            "update": "update",
        },

        update: function () {
            console.log("im fucking here");
            this.render();
        },

        initialize: function () {
            this.model.get('Components');

            for (var i = 0; i < this.model.get('Components').length; i++) {
                var id = this.model.get('Components')[i];
                this.populate(id, i);
            }
          //  this.subViews.on('click .component', this.render, this);
        },

        populate: function (id, posit) {
            var self = this;
            var dashboardComponent = new DashboardComponent({ Id: id });
            dashboardComponent.fetch({
                success: function (model, response) {
                    console.log("GET", id, "Success", model, response);
                    model.set(jQuery.parseJSON(model.get('Definition')));
                    console.log(model);
                    self.renderSubview('#component-by-type-' + posit, new ComponentGeneratedView(model, posit));
                },
                error: function (model, response) {
                    console.log("GET", id, "Fail", model, response);
                    return null;
                }
            });
        },

        render: function () {
            this.$el.html(this.template({ ComponentCount: this.model.get('Components').length }));
            return this;
        }
    });

    return DashboardView;
});
