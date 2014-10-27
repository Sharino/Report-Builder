define('DashboardView', [
    'BaseCompositeView',
    'DashboardComponent',
    'ComponentView',
    'DashboardComponentView',
    'MetricCollection',
    'MetricListView',
    'text!templates/dashboard.html',
    'KPIView',
    'Config',
    'adform-notifications'
], function (BaseCompositeView, DashboardComponent, ComponentView, DashboardComponentView, MetricCollection, MetricListView, dashboardTemplate, KPIView, Config) {
    var DashboardView = BaseCompositeView.extend({
        template: _.template(dashboardTemplate),


        events: {
            'click .component': 'toggle'
        },

        toggle: function (e) {
            var rawId = e.target.parentElement.id;
            rawId = rawId.replace('component-', '');

            var id = parseInt(rawId);
            this.renderSubview(('#component-edit-' + id), new ComponentView({ model: this.model.get("Components")[id] }));
        },

        initialize: function () {
            this.render();
            for (var i = 0; i < this.model.get('ComponentIds').length; i++) {
                var id = this.model.get('ComponentIds')[i];
                this.populate(id, i);
            }
        },

        populate: function (id, position) {
            var self = this;
            var dashboardComponent = new DashboardComponent({ Id: id });
            dashboardComponent.fetch({
                success: function (model, response) {
                    //console.log("GET", id, "Success", model, response);
                    model.set(jQuery.parseJSON(model.get('Definition')));

                    self.model.get("Components").push(model);


                    switch (model.get("Type")) {
                        case 0:
                        {
                            self.renderSubview(("#component-" + position), new KPIView({ model: model }));
                            break;
                        }
                        case 1:
                        {
                            self.renderSubview(("#component-" + position), new KPIView({ model: model }));
                            break;
                        }
                        case 2:
                        {
                            break;
                        }
                        case 3:
                        {
                            break;
                        }
                        case 4:
                        {
                            break;
                        }
                    }

                    return model;
                },
                error: function (model, response) {
                    console.log("GET", id, "Fail", model, response);
                    return null;
                }
            });
        },

        render: function () {
            this.$el.html(this.template({ ComponentCount: this.model.get("ComponentIds").length }));
            return this;
        }
    });

    return DashboardView;
});
