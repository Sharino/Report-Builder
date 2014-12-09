﻿define('GenerateView', [
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
            this.$el.html(this.template());

            var startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
            var endDate = moment().format('YYYY-MM-DD');

            this.dateView = this.renderSubview("#date-filter", new DateFilterView({ from: startDate, to: endDate }, 1));
            
            switch (this.model.get("Type")) {
                case 0:
                    {
                       // this.componentView = this.renderSubview("#component-by-type", new KPIView(this.model, 1, this.origin, this.dateView));
                        break;
                    }
                case 1:
                    {
                        this.componentView = this.renderSubview(("#component-by-type"), new KPIView(this.model, 1, this.origin, this.dateView));
                        break;
                    }
                case 2:
                    {
                        this.componentView = this.renderSubview(("#component-by-type"), new TableView(this.model, 1, this.origin, this.dateView));
                        break;
                    }
                case 3:
                    {
                        this.componentView = this.renderSubview(("#component-by-type"), new TimelineView(this.model, 1, this.origin, this.dateView));
                        break;
                    }
                case 4:
                    {
                        this.componentView = this.renderSubview(("#component-by-type"), new ChartView(this.model, 1, this.origin, this.dateView));
                        break;
                    }
            }
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
        }
    });

    return GenerateView;
});
