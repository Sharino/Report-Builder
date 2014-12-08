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
    'DashboardSelectionView',
    'MessageView',
    'Config',
    'adform-notifications',
    'adform-modal'
], function (BaseCompositeView, Component, MetricCollection, MetricListView, KPIView, TableView, TimelineView, ChartView,
             generateTemplate, DateFilterView, selectDashboardListTemplate, DashboardCollection, DashboardComponent, DashboardSelectionView, MessageView, Config) {
    var GenerateView = BaseCompositeView.extend({
        template: _.template(generateTemplate),
        selectDashboardTemplate: _.template(selectDashboardListTemplate),

        events: {
            'click .edit-form': 'handleEditAction',
            'click #generate-submit': 'handleAddToDashboardAction'
        },

        initialize: function (model, origin) {
            this.origin = origin;
        },

        handleEditAction: function (e) {
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
                    this.renderSubview(("#component-by-type"), new KPIView(this.model, 0, this.origin));
                    break;
                }
                case 1:
                {
                    this.renderSubview(("#component-by-type"), new KPIView(this.model, 0, this.origin));
                    break;
                }
                case 2:
                {
                    this.renderSubview(("#component-by-type"), new TableView(this.model, 0, this.origin));
                    break;
                }
                case 3:
                {
                    this.renderSubview(("#component-by-type"), new TimelineView(this.model, 0, this.origin));
                    break;
                }
                case 4:
                {
                    this.renderSubview(("#component-by-type"), new ChartView(this.model, 0, this.origin));
                    break;
                }
            }

            return this;
        },

        handleAddToDashboardAction: function () {
            $("#component-by-type").append("<div id='dashboard-selection'></div>");
            this.renderSubview("#dashboard-selection", new DashboardSelectionView(this.model));
            return false;
        }
    });

    return GenerateView;
});
