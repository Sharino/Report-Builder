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
    'MessageView',
    'Config',
    'Export',
    'DateFilterView',
    'adform-notifications',
    'adform-modal'
], function (BaseCompositeView, DashboardComponent, ComponentView, DashboardComponentView, MetricCollection, MetricListView, dashboardTemplate,
             KPIView, TimelineView, MessageView, Config, Export, DateFilterView) {
    var startDate = moment().format('YYYY-MM-DD');
    var DashboardView = BaseCompositeView.extend({
        template: _.template(dashboardTemplate),

        events: {
            'click .edit-form': 'edit',
            'click .csv': 'csv',
            'click .pdf': 'pdf',
            'click .xls': 'xls',
            'click .del': 'deleteDashboardComponent'
        },

        initialize: function () {
            Backbone.View.prototype.submitEvent = _.extend({}, Backbone.Events);

            this.render();
            for (var i = 0; i < this.model.get('ComponentIds').length; i++) {
                var id = this.model.get('ComponentIds')[i];
                this.populate(id, i);
            }
        },

        deleteDashboardComponent: function (e) {
            e.preventDefault();
            var id = parseInt($(e.currentTarget).attr('data-id'));

            var shit = new DashboardComponent({ Id: id });
            shit.destroy({
                success: function() {
                    alert("yay");
                },
                error: function() {
                    alert("gay");
                }
            });
            Backbone.history.loadUrl(Backbone.history.fragment);
            return false;
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
                                self.componentView[position] = self.renderSubview(("#component-" + position), new MessageView('<img src="http://i.imgur.com/iScdHje.png"></img>'));
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
            return this;
        },

        csv: function (e) {
            e.preventDefault();
            var id = parseInt($(e.currentTarget).attr('data-id'));

            var compValues = this.componentView[id].einsteinData.get('ComponentValues')[0].MetricValues;
            Export.exportCsv(compValues, {
                success: function (data, status, jqXHR) {
                    window.location.assign(data);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $.notifications.display({
                        type: 'error',
                        content: "Unable to export component data.", // TODO Move to config for multilanguage later
                        timeout: Config.NotificationSettings.Timeout
                    });
                }
            });
        },

        pdf: function (e) {
            e.preventDefault();
            var id = parseInt($(e.currentTarget).attr('data-id'));

            var compValues = this.componentView[id].einsteinData.get('ComponentValues')[0].MetricValues;
            Export.exportPdf(compValues, {
                success: function (data, status, jqXHR) {
                    window.location.assign(data);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $.notifications.display({
                        type: 'error',
                        content: "Unable to export component data.", // TODO Move to config for multilanguage later
                        timeout: Config.NotificationSettings.Timeout
                    });
                }
            });
        },

        xls: function (e) {
            e.preventDefault();
            var id = parseInt($(e.currentTarget).attr('data-id'));

            var compValues = this.componentView[id].einsteinData.get('ComponentValues')[0].MetricValues;
            Export.exportXls(compValues, {
                success: function (data, status, jqXHR) {
                    window.location.assign(data);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $.notifications.display({
                        type: 'error',
                        content: "Unable to export component data.", // TODO Move to config for multilanguage later
                        timeout: Config.NotificationSettings.Timeout
                    });
                }
            });
        }
    });

    return DashboardView;
});
