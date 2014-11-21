﻿define('GenerateView', [
    'BaseCompositeView',
    'Component',
    'MetricCollection',
    'MetricListView',
    'KPIView',
    'TimelineView',
    'text!templates/generate.html',
    'DateFilterView',
    'text!templates/selectDashboardList.html',
    'DashboardCollection',
    'DashboardComponent',
    'MessageView',
    'adform-notifications',
    'adform-modal'
], function (BaseCompositeView, Component, MetricCollection, MetricListView, KPIView, TimelineView,
             generateTemplate, DateFilterView, selectDashboardListTemplate, DashboardCollection, DashboardComponent, MessageView) {
    var GenerateView = BaseCompositeView.extend({
        template: _.template(generateTemplate),
        selectDashboardTemplate: _.template(selectDashboardListTemplate),

        events: {
            'click #edit': 'edit',
            'click #generate-submit': 'addToDashboard',
        },

        initialize: function () {
            if (!this.collection) {
                this.collection = new DashboardCollection();

                this.collection.fetch({
                    success: function (collection, response) {

                    },
                    error: function (collection, response) {
                        console.log(collection);
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
                    this.renderSubview(("#component-by-type"), new TimelineView(this.model, 0));
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
                buttons: [
                    //{
                    //    title: "Submit",
                    //    cssClass: "btn-success disabled",
                    //    dismiss: false
                    //},
                    //{
                    //    title: "Cancel",
                    //    cssClass: "btn-cancel",
                    //    id: "modalCancel"
                    //}
                ],
                className: "form"
            });

            var self = this;

            $(".dashboard-list-item").bind("click", function (e) {
                var reportComponentId = self.model.get("Id");
                var selectedDashboardId = parseInt(e.currentTarget.id);
                
//                console.log(reportComponentId, selectedDashboardId);

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
