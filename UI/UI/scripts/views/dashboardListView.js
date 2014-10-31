define('DashboardListView', [
    'BaseCompositeView',
    'DashboardCollection',
    'text!templates/dashboardList.html',
    'adform-notifications',
    'Config'
], function (BaseCompositeView, DashboardCollection, dashboardListTemplate, AdformNotification, Config) {
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
            var templVariables = {
                "data": {
                    "viewTitle": "",
                    "activeNew": "",
                    "activeList": ""
                }
            };

            templVariables["activeNew"] = '';
            templVariables["activeList"] = 'class="active"';

            this.$el.html(this.template({
                "Dashboards": this.collection.toJSON(),
                "data": templVariables
            }));
            return this;
        },

        submitNewDashboard: function () {
            var routerUrl = "createDashbaord";

            Backbone.history.navigate(routerUrl, true, true);
        },

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

            this.render();
        },

    });

    return DashboardListView;
});
