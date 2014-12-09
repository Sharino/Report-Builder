define('GenerateView', [
    'BaseCompositeView',
    'Component',
    'MetricCollection',
    'MetricListView',
    'KPIView',
    'TableView',
    'TimelineView',
    'ChartView',
    'text!templates/generate.html',
    'DateFilterView',
    'text!templates/selectDashboardList.html',
    'DashboardCollection',
    'DashboardComponent',
    'MessageView',
    'Config',
    'adform-notifications',
    'adform-modal'
], function (BaseCompositeView, Component, MetricCollection, MetricListView, KPIView, TableView, TimelineView, ChartView,
             generateTemplate, DateFilterView, selectDashboardListTemplate, DashboardCollection, DashboardComponent, MessageView, Config) {
    var GenerateView = BaseCompositeView.extend({
        template: _.template(generateTemplate),
        selectDashboardTemplate: _.template(selectDashboardListTemplate),

        events: {
            'click .edit-form': 'edit',
            'click #generate-submit': 'addToDashboard',
            'click #generateByDate': 'generateNewData'
        },

        initialize: function (model, origin) {
            this.origin = origin;
            if (!this.collection) {
                this.collection = new DashboardCollection();

                this.collection.fetch({
                    success: function () {

                    },
                    error: function () {
                        console.log("Failed to load dashboard collection");
                    }
                });
            }
        },
        edit: function (e) {
            e.preventDefault();

            var id = $(e.currentTarget).attr("comp-id");
            var routerUrl = "create/".concat(id);

            Backbone.history.navigate(routerUrl, true, true);
        },

        render: function () {
            this.$el.html(this.template({
                Origin: this.origin
            }));

            var startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
            var endDate = moment().format('YYYY-MM-DD');

            this.dateView = this.renderSubview("#date-filter", new DateFilterView({ from: startDate, to: endDate }, 1));

            var self = this;

            _.defer(function () {
                switch (self.model.get("Type")) {
                    case 1:
                        {
                            self.componentView = self.renderSubview(("#component-by-type"), new KPIView(self.model, 1, self.origin, self.dateView));
                            break;
                        }
                    case 2:
                        {
                            self.componentView = self.renderSubview(("#component-by-type"), new TableView(self.model, 1, self.origin, self.dateView));
                            break;
                        }
                    case 3:
                        {
                            self.componentView = self.renderSubview(("#component-by-type"), new TimelineView(self.model, 1, self.origin, self.dateView));
                            break;
                        }
                    case 4:
                        {
                            self.componentView = self.renderSubview(("#component-by-type"), new ChartView(self.model, 1, self.origin, self.dateView));
                            break;
                        }
                }
            });

            return this;
        },

        addToDashboard: function () {
            var modal = $.modal();

            $.modal({
                title: "Select Dashboard",
                body: this.selectDashboardTemplate({ Dashboards: this.collection.toJSON() }),
                className: "form"
            });

            var self = this;

            $(".dashboard-list-item").bind("click", function (e) {
                var reportComponentId = self.model.get("Id");
                var selectedDashboardId = parseInt(e.currentTarget.id);

                $.ajax({
                    url: Config.DashboardComponentSettings + "?dashboardId=" + selectedDashboardId + "&reportComponentId=" + reportComponentId,

                    type: 'post',
                    success: function () {
                        $.notifications.display({
                            type: 'success',
                            content: "Successfully added to Dashboard.",
                            timeout: Config.NotificationSettings.Timeout
                        });
                    },
                    error: function () {
                        $.notifications.display({
                            type: 'error',
                            content: "Could not add to Dashboard.",
                            timeout: Config.NotificationSettings.Timeout
                        });
                    }
                });

                modal.modal("hide");
            });

            return false;
        },

        generateNewData: function () {
            this.componentView.render();
        }
    });

    return GenerateView;
});
