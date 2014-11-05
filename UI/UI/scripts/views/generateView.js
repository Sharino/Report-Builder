define('GenerateView', [
    'BaseCompositeView',
    'Component',
    'MetricCollection',
    'MetricListView',
    'KPIView',
    'text!templates/generate.html',
    'DateFilterView',
    'text!templates/selectDashboardList.html',
    'DashboardCollection',
    'DashboardComponent',
    'MessageView',
    'adform-notifications',
    'adform-modal'
], function (BaseCompositeView, Component, MetricCollection, MetricListView, KPIView, generateTemplate, DateFilterView, selectDashboardListTemplate, DashboardCollection, DashboardComponent, MessageView) {
    var GenerateView = BaseCompositeView.extend({
        template: _.template(generateTemplate),
        selectDashboardTemplate: _.template(selectDashboardListTemplate),

        events: {
            'click #generate-submit': 'addToDashboard',
        },

        initialize: function(){
            if (!this.collection) {
                this.collection = new DashboardCollection();

                this.collection.fetch({
                    success: function (collection, response) {
                        console.log(collection);
                    },
                    error: function (collection, response) {
                        console.log(collection);
                    }
                });
            }
        },

        render: function () {
            this.$el.html(this.template());
         
//            this.renderSubview("#date-filter", new DateFilterView({
//                from: '2050-01-01',
//                to: '2060-01-01'
//            }));

            switch (this.model.get("Type")) {
                case 0:
                {
                    this.renderSubview(("#component-by-type"), new KPIView(this.model, 0));
                    break;
                }
                case 1:
                {
                    this.renderSubview(("#component-by-type"), new KPIView(this.model, 0));
                    break;
                }
                case 2:
                {
                    this.renderSubview(("#component-by-type"), new MessageView('<img src="http://i.imgur.com/5wKFPkc.png"></img>'));
                    break;
                }
                case 3:
                {
                    this.renderSubview(("#component-by-type"), new MessageView('<img src="http://i.imgur.com/bAmN3M9.png"></img>'));
                    break;
                }
                case 4:
                {
                    this.renderSubview(("#component-by-type"), new MessageView('<img src="http://i.imgur.com/iScdHje.png"></img>'));
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
                buttons: [],
                className: "form"
            });

            var self = this;

            $(".dashboard-list-item").bind("click", function (e) {
                var reportComponentId = self.model.get("Id");
                var selectedDashboardId = parseInt(e.currentTarget.id);
                
                console.log(reportComponentId, selectedDashboardId);

                //
                //var tempDashboardComponent = new DashboardComponent({ dashboardId: selectedDashboardId, reportComponentId: reportComponentId });
                //tempDashboardComponent.save({}, {
                //    success: function (collection, response) {
                //        console.log("YAY", collection);
                //    },
                //    error: function (collection, response) {
                //        console.log(collection);
                //    }
                //});

                $.ajax({
                    url: "http://37.157.0.42:33895/api/DashboardComponent?dashboardId=" + selectedDashboardId + "&reportComponentId=" + reportComponentId,

                    type: 'post',
                    success: function () {
                        console.log('success!');
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
