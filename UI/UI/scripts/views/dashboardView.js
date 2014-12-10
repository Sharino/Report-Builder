define('DashboardView', [
    'BaseCompositeView',
    'DashboardComponent',
    'ComponentView',
    'DashboardComponentView',
    'MetricCollection',
    'MetricListView',
    'text!templates/dashboard.html',
    'KPIView',
    'TableView',
    'TimelineView',
    'ChartView',
    'MessageView',
    'Config',
    'Export',
    'DateFilterView',
    'adform-notifications',
    'adform-modal'
], function (BaseCompositeView, DashboardComponent, ComponentView, DashboardComponentView, MetricCollection, MetricListView, dashboardTemplate,
             KPIView, TableView, TimelineView, ChartView, MessageView, Config, Export, DateFilterView) {

    var DashboardView = BaseCompositeView.extend({
        template: _.template(dashboardTemplate),

        events: {
            'click .edit-form': 'edit',
            'click .del': 'deleteDashboardComponent',
            'click .csv': 'csv',
            'click .up': 'moveDashboardComponentUp',
            'click .down': 'moveDashboardComponentDown',
            'click #generateByDate': 'generateNewData'
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

        generateNewData: function (e) {
            //var pos = parseInt($(e.currentTarget).parent().parent().parent().attr('data-id'));
            var pos = parseInt($(e.currentTarget).parent().parent().parent().attr('comp-id'));
            var compIds = this.model.get('ComponentIds');
            if (compIds.length > 0) {
                var idIndex = compIds.indexOf(pos);
                this.componentView[idIndex].render();
            }
        },

        render: function () {
            this.$el.html(this.template({
                title: this.model.get('Title'),
                ComponentCount: this.model.get("ComponentIds").length,
                ComponentIds: this.model.get("ComponentIds")
            }));

            var compIds = this.model.get('ComponentIds');

            if (compIds.length === 0) {
                this.componentView = [];
                this.renderSubview("#message", new MessageView("Dashboard is currently empty : ("));
            }

            var from = moment().subtract(7, 'days').format('YYYY-MM-DD');
            var to = moment().subtract('days', 1).format('YYYY-MM-DD');

            //            this.renderSubview("#date-filter", new DateFilterView({
            //                from: from,
            //                to: to,
            //                origin: "Dashboard"
            //            }));

            return this;
        },

        deleteDashboardComponent: function (e) {
            e.preventDefault();
            var id = parseInt($(e.currentTarget).attr('data-id'));

            var self = this;
            var comp = new DashboardComponent({ Id: id });

            $.modal({
                title: "Confirmation",
                body: "Do you really want to delete this dashboard component?",
                buttons: [
                    {
                        title: "Yes",
                        cssClass: "btn-success",
                        callback: function () {
                            comp.destroy({
                                success: function () {
                                    var compIds = self.model.get("ComponentIds");
                                    if (compIds.length > 0) {
                                        var idIndex = compIds.indexOf(id);
                                        if (idIndex > -1) {
                                            compIds.splice(idIndex, 1);
                                            self.model.save("ComponentIds", compIds);
                                            self.componentView.splice(idIndex, 1);

                                            for (var i = 0, len = self.subViews.length; i < len; i++) {
                                                if (self.subViews[i].id === id) {
                                                    $("#date-filter-" + idIndex).remove();
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
                        },
                    },
                    { title: "Cancel", cssClass: "btn-cancel" }
                ]
            });
        },

        moveDashboardComponentUp: function (e) {
            e.preventDefault();

            var id = parseInt($(e.currentTarget).attr('data-id'));

            var compIds = this.model.get("ComponentIds");

            if (compIds.length > 0) {
                var idIndex = compIds.indexOf(id);
                var prevIdIndex = idIndex - 1;

                if (idIndex > 0) {
                    this.model.save("ComponentIds", this.arraySwap(this.model.get("ComponentIds"), idIndex, prevIdIndex));

                    this.componentView = this.arraySwap(this.componentView, idIndex, prevIdIndex);

                    var allElements = $(this.el).find(".row").siblings(".row").andSelf();
                    var currentElement = allElements[idIndex];
                    var nextElement = allElements[prevIdIndex];

                    this.elementSwap(currentElement, nextElement);
                }
            }
        },

        moveDashboardComponentDown: function (e) {
            e.preventDefault();
            var id = parseInt($(e.currentTarget).attr('data-id'));

            var compIds = this.model.get("ComponentIds");

            if (compIds.length > 0) {
                var idIndex = compIds.indexOf(id);
                var nextIdIndex = idIndex + 1;

                if (idIndex > -1 && idIndex < compIds.length - 1) {
                    this.componentView = this.arraySwap(this.componentView, idIndex, nextIdIndex);

                    this.model.save("ComponentIds", this.arraySwap(this.model.get("ComponentIds"), idIndex, nextIdIndex));

                    var allElements = $(this.el).find(".row").siblings(".row").andSelf();
                    var currentElement = allElements[idIndex];
                    var nextElement = allElements[nextIdIndex];

                    this.elementSwap(currentElement, nextElement);
                }
            }
        },

        arraySwap: function (arr, fromIndex, toIndex) {
            var temp = arr[fromIndex];
            arr[fromIndex] = arr[toIndex];
            arr[toIndex] = temp;

            return arr;
        },

        elementSwap: function (a, b) {
            a = $(a); b = $(b);
            var tmp = $('<span>').hide();
            a.before(tmp);
            b.before(a);
            tmp.replaceWith(b);
        },

        edit: function (e) {
            e.preventDefault();

            var id = parseInt($(e.currentTarget).attr('data-id'));

            var compIds = this.model.get("ComponentIds");

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
                                if (compIds.length > 0) {
                                    var componentId = parseInt($(e.currentTarget).attr('comp-id'));
                                    var idIndex = compIds.indexOf(componentId);
                                    self.componentView[idIndex].render();
                                    console.log(self.componentView, "idIndex", idIndex);
                                    console.log(compIds, componentId);
                                }
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
            this.dateView = [];
            var dashboardComponent = new DashboardComponent({ Id: id });
            dashboardComponent.fetch({
                success: function (model) {
                    model.set(jQuery.parseJSON(model.get('Definition')));

                    self.model.get("Components")[position] = model;

                    var startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
                    var endDate = moment().subtract(1, 'days').format('YYYY-MM-DD');

                    self.dateView[position] = self.renderSubview("#date-filter-" + position, new DateFilterView({ from: startDate, to: endDate }, position + 1));
                    $("#date-filter-" + position).css("visibility", "hidden");
                    _.defer(function() {
                        switch (model.get("Type")) {
                        case 1:
                        {
                            self.componentView[position] = self.renderSubview(("#component-" + position), new KPIView(model, position, "dashboard", self.dateView[position]));
                            break;
                        }
                        case 2:
                        {
                            self.componentView[position] = self.renderSubview(("#component-" + position), new TableView(model, position, "dashboard", self.dateView[position]));
                            break;
                        }
                        case 3:
                        {
                            self.componentView[position] = self.renderSubview(("#component-" + position), new TimelineView(model, position, "dashboard", self.dateView[position]));
                            break;
                        }
                        case 4:
                        {
                            self.componentView[position] = self.renderSubview(("#component-" + position), new ChartView(model, position, "dashboard", self.dateView[position]));
                            break;
                        }
                        }
                        _.defer(function () { $("#date-filter-" + position).css("visibility", "visible"); });
                    });
                    return model;
                },
                error: function (model, response) {
                    return null;
                }
            });
        },

        csv: function (e) {//Kpi Only ;(
            e.preventDefault();
            var dashboardData = [];
            var compView = this.componentView;
            for (var i = 0; i < compView.length; i++) {
                var componentData = {
                    Title: compView[i].model.get("Title"),
                    Values: compView[i].einsteinData.get('ComponentValues')[0].MetricValues,
                    StartDate: $("#dashboard-component-" + i).find("#picker").find("input")[0].value,
                    EndDate: $("#dashboard-component-" + i).find("#picker2").find("input")[0].value,
                    GeneratedDate: moment().format('YYYY-MMM-DD hh:mm:ss a')
                };
                dashboardData.push(componentData);
            }
            Export.dashboardToCsv(dashboardData, {
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
    });

    return DashboardView;
});
