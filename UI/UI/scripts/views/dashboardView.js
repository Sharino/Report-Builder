define('DashboardView', [
    'BaseCompositeView',
    'DashboardComponent',
    'ComponentView',
    'DashboardComponentView',
    'MetricCollection',
    'MetricListView',
    'text!templates/dashboard.html',
    'KPIView',
    'MessageView',
    'Config',
    'DateFilterView',
    'adform-notifications',
    'adform-modal'
], function (BaseCompositeView, DashboardComponent, ComponentView, DashboardComponentView, MetricCollection, MetricListView, dashboardTemplate, KPIView, MessageView, Config, DateFilterView) {

    var startDate = moment().format('YYYY-MM-DD');

    var DashboardView = BaseCompositeView.extend({
        template: _.template(dashboardTemplate),
       
        events: {
            'click .editable ': 'toggle',
            'click #edit': 'edit',
            'click .dashboard-list-item>.del': 'handleDeleteAction'
        },
       
        edit: function (e) {
            e.preventDefault();

            var pos = parseInt($(e.currentTarget).closest('i').attr('data-id'));

            if (!isNaN(pos)) {
                var currentModel = this.model.get("Components")[pos];

                this.editform = this.renderSubview(('#component-edit-' + pos), new DashboardComponentView({ model: currentModel }));

                var self = this;

                var modal = $.modal();

                modal.on('hidden', function () {
                    self.editform.destroy();

                    for (var i = 0; i < self.subViews.length; i++) {
                        if (self.subViews[i] === self.editform) {
                            self.subViews.splice(i, 1);
                            self.editform = null;
                            break;
                        }
                    }

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

                this.$el.find(("#component-" + pos)).append("<div id='component-edit-" + pos + "'></div>");
            }

        },

        handleDeleteAction: function (e) {
            e.preventDefault();
            alert("s");
            var id = $(e.currentTarget).attr("id");
            var dashboard = this.collection.get(id);

            dashboard.destroy({
                success: function (result) {
                    $.notifications.display({
                        type: 'success',
                        content: 'Successfully deleted!',
                        timeout: Config.NotificationSettings.Timeout
                    });
                },
                error: function (response) {
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

            this.render();
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
                                self.renderSubview(("#component-" + position), new KPIView(model, position));
                                break;
                            }
                        case 1:
                            {
                                self.renderSubview(("#component-" + position), new KPIView(model, position));
                                break;
                            }
                        case 2:
                            {
                                self.renderSubview(("#component-" + position), new MessageView('<img src="http://i.imgur.com/5wKFPkc.png"></img>'));
                                break;
                            }
                        case 3:
                            {
                                self.renderSubview(("#component-" + position), new MessageView('<img src="http://i.imgur.com/bAmN3M9.png"></img>'));
                                break;
                            }
                        case 4:
                            {
                                self.renderSubview(("#component-" + position), new MessageView('<img src="http://i.imgur.com/iScdHje.png"></img>'));
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
            this.renderSubview("#date-filter", new DateFilterView({
                from: startDate,
                to: startDate
            }));
            return this;
        }
    });

    return DashboardView;
});
