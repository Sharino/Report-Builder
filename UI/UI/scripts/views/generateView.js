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
            'click #generate-submit': 'handleAddToDashboardAction',
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
        handleEditAction: function (e) {
            e.preventDefault();

            var id = $(e.currentTarget).attr("comp-id");
            var routerUrl = "create/".concat(id);

            Backbone.history.navigate(routerUrl, true, true);
        },

        render: function () {
            this.$el.html(this.template({
                Origin: this.origin
            }));
            $("body").removeClass("component-edit");
            var startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
            var endDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
            
            this.dateView = this.renderSubview("#date-filter", new DateFilterView({ from: startDate, to: endDate }, 1, "generate"));
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

        handleAddToDashboardAction: function () {
            $("#component-by-type").append("<div id='dashboard-selection'></div>");
            this.renderSubview("#dashboard-selection", new DashboardSelectionView(this.model));
            return false;
        },

        generateNewData: function () {
            this.componentView.render();
        }
    });

    return GenerateView;
});
