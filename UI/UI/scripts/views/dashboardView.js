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
            console.log("rawid: " + rawId);
            rawId = rawId.replace('component-', '');

            var id = parseInt(rawId);
            if (this.flag === false) {
                this.editform = this.renderSubview(('#component-edit-' + id), new ComponentView({ model: this.model.get("Components")[id] }));
                this.flag = true;
            } else {
                this.editform.destroy(); //Lops naikina divus
                this.flag = false;
                this.$el.find(".editable").append("<div id='component-edit-" + id + "'></div>");
            }
        },

        initialize: function () {
            this.flag = new Boolean;
            this.flag = false;
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
