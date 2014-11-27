define('DashboardView', [
    'BaseCompositeView',
    'DashboardComponent',
    'ComponentView',
    'DashboardComponentView',
    'MetricCollection',
    'MetricListView',
    'text!templates/dashboard.html',
    'KPIView',
    'TimelineView',
    'ChartView',
    'MessageView',
    'Config',
    'Export',
    'DateFilterView',
    'adform-notifications',
    'adform-modal'
], function (BaseCompositeView, DashboardComponent, ComponentView, DashboardComponentView, MetricCollection, MetricListView, dashboardTemplate,
             KPIView, TimelineView, ChartView, MessageView, Config, Export, DateFilterView) {

    var startDate = moment().format('YYYY-MM-DD');

    var DashboardView = BaseCompositeView.extend({
        template: _.template(dashboardTemplate),

        events: {
            'click .edit-form': 'edit',
            'click .del': 'deleteDashboardComponent'
        },

        initialize: function () {
            Backbone.View.prototype.submitEvent = _.extend({}, Backbone.Events);
            var compIds = this.model.get('ComponentIds');
            for (var i = 0; i < compIds.length; i++) {
                var id = compIds[i];
                this.populate(id, i);
            }
            this.render();
        },

        deleteDashboardComponent: function (e) {
            e.preventDefault();
            var id = parseInt($(e.currentTarget).attr('data-id'));
            console.log("Sitas id: ", id);

            var self = this;
            var comp = new DashboardComponent({ Id: id });

            $.modal({
                title: "Confirmation",
                body: "Do you really want to delete this dashboard component?",
                buttons: [
                    {
                        title: "Yes",
                        cssClass: "btn-success",
                        callback: function() {
                            comp.destroy({
                                success: function() {
                                    var compIds = self.model.get("ComponentIds");
                                    if (compIds.length > 0) {
                                        var idIndex = compIds.indexOf(id);
                                        if (idIndex > -1) {
                                            compIds.splice(idIndex, 1);

                                            self.componentView.splice(idIndex, 1);

                                            for (var i = 0, len = self.subViews.length; i < len; i++) {
                                                if (self.subViews[i].id == id) {
                                                    self.destroySubView(i);
                                                    break;
                                                }
                                            }
                                            if (compIds.length == 0) {
                                                self.componentView[0] = self.renderSubview(("#message"), new MessageView("Dashboard is currently empty : ("));
                                            }
                                        }
                                    }
                                },
                                error: function(response) {
                                    if (response.responseJSON) {
                                        response.responseJSON.forEach(function (entry) {
                                            $.notifications.display({
                                                type: 'error',
                                                content: entry.Message,
                                                timeout: Config.NotificationSettings.Timeout
                                            });
                                        });
                                    }
                                }
                            });
                        },
                    },
                    { title: "Cancel", cssClass: "btn-cancel" }
                ]
            });
        },

        edit: function (e) {
            e.preventDefault();

            var id = parseInt($(e.currentTarget).attr('data-id'));

            if (!isNaN(id)) {
                var currentModel = this.model.get("Components")[id];
                this.editform = this.renderSubview(('#component-edit-' + id), new DashboardComponentView({ model: currentModel }));
                var self = this;
                var modal = $.modal();

                modal.on('hidden', function () {
                    self.destroySubView(self.editform);
                    self.editform = null;
                });

                $.modal({
                    title: "Edit Dashboard Component",
                    body: this.editform.$el,
                    buttons: [
                        {
                            title: "Submit",
                            id: "component-submit",
                            cssClass: "btn-success",
                            callback: function () {
                                self.submitEvent.trigger('submitEvent');
                            }
                        },
                        {
                            title: "Cancel",
                            cssClass: "btn-cancel",
                            id: "modalCancel",
                            callback: function () {
                            }
                        }
                    ],
                    className: "form"
                });

                this.$el.find(("#component-" + id)).append("<div id='component-edit-" + id + "'></div>");
            }

        },

        populate: function (id, position) {
            var self = this;
            this.componentView = [];
            var dashboardComponent = new DashboardComponent({ Id: id });
            dashboardComponent.fetch({
                success: function (model) {
                    model.set(jQuery.parseJSON(model.get('Definition')));

                    self.model.get("Components")[position] = model;

                    switch (model.get("Type")) {
                        case 1:
                            {
                                self.componentView[position] = self.renderSubview(("#component-" + position), new KPIView(model, position));
                                break;
                            }
                        case 2:
                            {
                                self.componentView[position] = self.renderSubview(("#component-" + position), new MessageView('<img src="http://i.imgur.com/5wKFPkc.png"></img>'));
                                break;
                            }
                        case 3:
                            {
                                self.componentView[position] = self.renderSubview(("#component-" + position), new TimelineView(model, position));
                                break;
                            }
                        case 4:
                            {
                                self.componentView[position] = self.renderSubview(("#component-" + position), new ChartView(model, position));
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
            this.$el.html(this.template({ title: this.model.get('Title'), ComponentCount: this.model.get("ComponentIds").length }));

            var compIds = this.model.get('ComponentIds');
            if (compIds.length === 0) {
                this.componentView = [];
                this.renderSubview("#message", new MessageView("Dashboard is currently empty : ("));
            }

            return this;
        }
    });

    return DashboardView;
});
