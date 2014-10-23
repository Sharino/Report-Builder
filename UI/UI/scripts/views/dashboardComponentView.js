define('DashboardComponentView', [
    'BaseCompositeView',
    'DashboardComponent',
    'MetricCollection',
    'MetricListView',
    'text!templates/dashboardComponent.html',
    'Config',
    'adform-notifications'
], function(BaseCompositeView, DashboardComponent, MetricCollection, MetricListView, dashboardComponentTemplate, Config) {
    var DashboardComponentView = BaseCompositeView.extend({
        model: new DashboardComponent,
        template: _.template(dashboardComponentTemplate),
        
        initialize: function (parentModel) {
            this.model = parentModel;
            console.log(this.model);
        },

        render: function () {
            this.$el.html(this.template({
                "model": this.model.toJSON()
            }));
        }

    });

    return DashboardComponentView;
});

