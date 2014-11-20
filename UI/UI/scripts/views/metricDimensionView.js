define('MetricDimensionView', [
    'BaseCompositeView',
    'text!templates/metricDimensions.html'

], function (BaseCompositeView, MetricDimensionsTemplate) {
    var MetricDimensionView = BaseCompositeView.extend({
        template: _.template(MetricDimensionsTemplate),

        initialize: function (parentModel, allMetrics, allDimensions) {
            var self = this;
   
            console.log("svie");
            allDimensions.forEach(function(){
                console.log(allDimensions.models);
            });
           
            this.dimensionArray = [];
            console.log(allDimensions);
            this.model = parentModel;
            console.log(this.dimensionArray);
          
            for (var i = 0; i < this.dimensionArray.length; i++) {
                this.dimensionArray[i].Order = i;
            }
            this.allDimensions = allDimensions;

            
        },

        render: function () {
            this.$el.html(this.template());
        }
    });

    return MetricDimensionView;
});