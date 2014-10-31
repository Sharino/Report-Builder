///* DEPRECATED */
//define('ComponentGeneratedView', [
//    'BaseCompositeView',
//    'DashboardComponent',
//    'Metric',
//    'MetricCollection',
//    'ComponentView',
//    'DashboardComponentView',
//    'KPIView',
//    'text!templates/table.html',
//    'text!templates/timeline.html',
//    'text!templates/chart.html'
//], function (BaseCompositeView, DashboardComponent, Metric, MetricCollection, ComponentView, DashboardComponentView, KPIView, TableTemplate, TimelineTemplate, ChartTemplate) {

//    var ComponentGeneratedView = BaseCompositeView.extend({
//        model: new DashboardComponent,


//        initialize: function (parentModel, position) {
//            this.model = parentModel;
//            this.position = position;
//        },

//        render: function () {
//            //var tpl;
//            //switch (this.model.get("Type")) {
//            //    case 0:
//            //        tpl = KPITemplate;
//            //        break;
//            //    case 1:
//            //        tpl = KPITemplate;
//            //        break;
//            //    case 2:
//            //        tpl = TableTemplate;
//            //        break;
//            //    case 3:
//            //        tpl = TimelineTemplate;
//            //        break;
//            //    case 4:
//            //        tpl = ChartTemplate;
//            //        break;
//            //    default:
//            //        tpl = KPITemplate;
//            //}

//            //console.log(this.model);

//            //var template = _.template(tpl);

           

//            return this;
//        },
//    });

//    return ComponentGeneratedView;
//});