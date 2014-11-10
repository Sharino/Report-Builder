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
            'click #edit': 'edit',
            'click .dashboard-list-item>.del': 'handleDeleteAction'
        },

        initialize: function () {
            Backbone.View.prototype.submitEvent = _.extend({}, Backbone.Events);

            this.render(); // TODO FIXME Strange
            for (var i = 0; i < this.model.get('ComponentIds').length; i++) {
                var id = this.model.get('ComponentIds')[i];
                this.populate(id, i);
            }
        },


        edit: function (e) {
            e.preventDefault();

            var id = parseInt($(e.currentTarget).closest('button').attr('data-id'));

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
            var dashboardComponent = new DashboardComponent({ Id: id });
            dashboardComponent.fetch({
                success: function (model) {
                    model.set(jQuery.parseJSON(model.get('Definition')));

                    self.model.get("Components")[position] = model;
                    
                    switch (model.get("Type")) {
//                        case 0:
//                            {
//                                $(("#component-" + position)).loader();
//                                self.renderSubview(("#component-" + position), new KPIView(model, position));
//                                break;
//                            }
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

//            this.renderSubview/**/("#date-filter", new DateFilterView());

//            this.renderSubview("#date-filter", new DateFilterView({
//                from: startDate,
//                to: startDate
//            }));

            return this;
        }
    });

    return DashboardView;
});
