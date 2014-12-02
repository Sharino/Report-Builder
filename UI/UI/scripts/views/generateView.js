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
        },

        initialize: function () {
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
            this.$el.html(this.template());

            switch (this.model.get("Type")) {
                case 0:
                {
                    this.renderSubview(("#component-by-type"), new KPIView(this.model, 0, false));
                    break;
                }
                case 1:
                {
                    this.renderSubview(("#component-by-type"), new KPIView(this.model, 0, false));
                    break;
                }
                case 2:
                {
                    this.renderSubview(("#component-by-type"), new TableView(this.model, 0, false));
                    break;
                }
                case 3:
                {
                    this.renderSubview(("#component-by-type"), new TimelineView(this.model, 0, false));
                    break;
                }
                case 4:
                {
                    this.renderSubview(("#component-by-type"), new ChartView(this.model, 0, false));
                    break;
                }
            }

            return this;
        },

        addToDashboard: function () {
            var modal = $.modal();

            $.modal({
                title: "Select Dashboard",
                body: this.selectDashboardTemplate({Dashboards: this.collection.toJSON()}),
                className: "form"
            });

            var self = this;

            $(".dashboard-list-item").bind("click", function (e) {
                var reportComponentId = self.model.get("Id");
                var selectedDashboardId = parseInt(e.currentTarget.id);

                $.ajax({
                    url: "http://37.157.0.42:33895/api/DashboardComponent?dashboardId=" + selectedDashboardId + "&reportComponentId=" + reportComponentId,

                    type: 'post',
                    success: function () {
                        $.notifications.display({
                            type: 'success',
                            content: "Successfully added to dashboard",
                            timeout: Config.NotificationSettings.Timeout
                        });
                    },
                    error: function () {
                        console.log('error!');
                    }
                });

                modal.modal("hide");
            });

            return false;
        }
    });

    return GenerateView;
});
