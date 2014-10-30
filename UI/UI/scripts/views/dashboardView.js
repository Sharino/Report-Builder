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
    'adform-notifications',
    'adform-modal'
], function (BaseCompositeView, DashboardComponent, ComponentView, DashboardComponentView, MetricCollection, MetricListView, dashboardTemplate, KPIView, Config) {
    var DashboardView = BaseCompositeView.extend({
        template: _.template(dashboardTemplate),

        events: {
            'click .editable': 'toggle'
        },

        toggle: function (e) {
            e.preventDefault();

            var pos = parseInt($(e.currentTarget).attr('data-id'));

            if (!isNaN(pos)) {
                var currentModel = this.model.get("Components")[pos];

                this.editform = this.renderSubview(('#component-edit-' + pos), new DashboardComponentView({ model: currentModel}));

                var self = this;

                var modal = $.modal();

                modal.on('hidden', function() {
                    self.editform.destroy();
                });


                $.modal({
                    title: "Edit Dashboard Component",
                    body: this.editform.$el,
                    buttons: [
                        {
                            title: "Submit",
                            id: "component-submit",
                            cssClass: "btn-success",
                            callback: function() {
                                self.submitEvent.trigger('submitEvent');
                            }
                        },
                        {
                            title: "Cancel",
                            cssClass: "btn-cancel",
                            id: "modalCancel",
                            callback: function() {
                            }
                        }
                    ],
                    className: "form"
                });

                this.$el.find(("#component-" + pos)).append("<div id='component-edit-" + pos + "'></div>");
            }
        },


        initialize: function () {
            Backbone.View.prototype.submitEvent = _.extend({}, Backbone.Events);

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
