define('DashboardListView', [
    'BaseCompositeView',
    'Dashboard',
    'DashboardCollection',
    'text!templates/dashboardList.html',
    'text!templates/dashboardCreate.html',
    'adform-notifications',
    'Config',
    'adform-modal'
], function (BaseCompositeView, Dashboard, DashboardCollection, dashboardListTemplate, DashboardCreate, AdformNotification, Config) {
    var DashboardListView = BaseCompositeView.extend({
        template: _.template(dashboardListTemplate),

        events: {
            'click .del': 'handleDeleteAction',
            'click .dashboard-list-item>.gen': 'onGenerate',
            'click .dashboard-list-item>.click': 'onClick',
            'click .create': 'submitNewDashboard'
        },

        initialize: function () {
            if (!this.collection) {
                this.collection = new DashboardCollection();
            }
            this.collection.on('remove', this.render, this);
            this.collection.on('fetch', this.render, this);
        },

        render: function () {
            this.$el.html(this.template({ "Dashboards": this.collection.toJSON() }));

            return this;
        },

        submitNewDashboard: function () {
            $.modal({
                title: "Create Dashboard",
                body: DashboardCreate,
                buttons: [
                    {
                        title: "Submit",
                        cssClass: "btn-success",
                        callback: function () {
                            var tempDashboard = new Dashboard({ Title: $("#dashboard-title").val() });

                            tempDashboard.save({}, {
                                success: function (model, response) {
                                    $.notifications.display({
                                        type: 'success',
                                        content: "New Dashboard was successfully created",
                                        timeout: Config.NotificationSettings.Timeout
                                    });

                                    Backbone.history.navigate("dashboard/" + model.get("Id"), { trigger: true });
                                },
                                error: function () {
                                    $.notifications.display({
                                        type: 'error',
                                        content: "Error",
                                        timeout: Config.NotificationSettings.Timeout
                                    });
                                }
                            });
                        }
                    },
                    {
                        title: "Cancel",
                        cssClass: "btn-cancel",
                        id: "modalCancel"
                    }
                ],
                className: "form"
            });
        },
        //TODO: RENAME 
        onClick: function (e) {
            console.log(e);
            e.preventDefault();

            var id = $(e.currentTarget).attr("id");
            var routerUrl = "dashboard/".concat(id);

            Backbone.history.navigate(routerUrl, true, true);
        },

        handleDeleteAction: function (e) {
            e.preventDefault();

            var id = $(e.currentTarget)[0].parentElement.id;
            var dashboard = this.collection.get(id);

            $.modal({
                title: "Confirmation",
                body: "Do you really want to delete this dashboard?",
                buttons: [
                    {
                        title: "Yes",
                        cssClass: "btn-success",
                        callback: function() {
                            dashboard.destroy({
                                success: function (result) {
                                    $.notifications.display({
                                        type: 'success',
                                        content: 'Successfully deleted!',
                                        timeout: Config.NotificationSettings.Timeout
                                    });
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
                        }
                    },
                    {
                        title: "Cancel",
                        cssClass: "btn-cancel",
                        callback: function() {
                            this.hide();
                        }
                    }
                ]
            });
            this.render();
        },

    });

    return DashboardListView;
});
