define('ComponentGeneratedView', [
    'BaseCompositeView',
    'DashboardComponent',
    'Metric',
    'MetricCollection',
    'ComponentView',
    'DashboardComponentView',
    'text!templates/kpi.html',
    'text!templates/table.html',
    'text!templates/timeline.html',
    'text!templates/chart.html'
], function (BaseCompositeView, DashboardComponent, Metric, MetricCollection, ComponentView, DashboardComponentView, KPITemplate, TableTemplate, TimelineTemplate, ChartTemplate) {

    var ComponentGeneratedView = BaseCompositeView.extend({
        model: new DashboardComponent,

        events: {
            'click .component': 'toggle'
        },
        
      
        toggle: function (e) {
            $(this.el).trigger('update');

            console.log("ID", this.model.get("Id"));
            console.log("POS", this.pos);
            this.renderSubview(("component-edit-" + this.pos), new DashboardComponentView(this.model));

            //this.showView(("component-edit-" + this.pos), new ComponentView({ model: this.model }));
            //self.renderSubview('#metric-list', new MetricListView(null, allMetrics));
            console.log("" + ("component-edit-" + this.pos));
            return false;
        },

        initialize: function (parentModel, pos) {
            this.model = parentModel;
            this.pos = pos;
        },

        render: function () {
            var tpl;
            switch (this.model.get("Type")) {
                case 0:
                    tpl = KPITemplate;
                    break;
                case 1:
                    tpl = KPITemplate;
                    break;
                case 2:
                    tpl = TableTemplate;
                    break;
                case 3:
                    tpl = TimelineTemplate;
                    break;
                case 4:
                    tpl = ChartTemplate;
                    break;
                default:
                    tpl = KPITemplate;
            }

            console.log(this.model);

            var template = _.template(tpl);

            this.$el.html(template({
                "Metrics": this.model.get('Metrics'),
                "model": this.model.toJSON()
            })); // Render Metric list      
        },
    });

    return ComponentGeneratedView;
});