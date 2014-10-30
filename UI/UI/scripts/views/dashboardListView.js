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
            'click .dashboard-list-item>.del': 'handleDeleteAction',
            'click .dashboard-list-item>.gen': 'onGenerate',
            'click .dashboard-list-item>.click': 'onClick',
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

        onClick: function (e) {
            console.log(e);
            e.preventDefault();

            var id = $(e.currentTarget).attr("id");
            var routerUrl = "dashboard/".concat(id);

            Backbone.history.navigate(routerUrl, true, true);
        },

        handleDeleteAction: function (e) {
            e.preventDefault();

            var id = $(e.currentTarget).attr("id");
            
            $.ajax({
                url: 'http://172.22.22.33:33894/api/dashboard' + id,
                type: 'DELETE',
                success: function (result) {
                    $.notifications.display({
                        type: 'success',
                        content: 'Successfully deleted!',
                        timeout: Config.NotificationSettings.Timeout
                    });
                },
                error: function (response){
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
        },

    });

    return DashboardListView;
});
