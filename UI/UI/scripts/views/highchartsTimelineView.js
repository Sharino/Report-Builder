define('HighchartsTimelineView', [
    'BaseCompositeView',
    'Highcharts',
    'HighchartsTheme'
], function (BaseCompositeView) {
    var HighchartsTimelineView = BaseCompositeView.extend({

        initialize: function (options) {
            this.options = options;

            if (!options) {
                this.einstein = this.options.einstein;
                this.selectedMetricsNames = this.options.selectedMetricsNames;
            } else {
                this.einstein = options.einstein;
                this.selectedMetricsNames = options.selectedMetricsNames;
            }
        },

        render: function () {


            this.$el.highcharts({
                title: {
                    text: null,
                },
                xAxis: {
                    gridLineColor: '#cbe5f5',
                    lineColor: '#cbe5f5',
                    categories: this.getXAxis(),
                    labels: {
                        step: Math.round(this.getXAxis().length / 5),
                        staggerLines: 1,
                        y: 20,
                        style: {
                            'font-family': "Open Sans, Helvetica Neue, Helvetica, Arial, sans-serif"
                        }
                    },
                    tickLength: 0,
                    minPadding: 12,
                    maxPadding: 12,
                },
                yAxis: {
                    title: {
                        text: null,
                    },
                    showFirstLabel: true,
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#cbe5f5'
                    }],
                    gridLineColor: '#cbe5f5',
                    lineColor: '#cbe5f5',
                    labels: {
                        align: 'center',
                        x: -25,
                        y: 5,
                        style: {
                            'font-family': "Open Sans, Helvetica Neue, Helvetica, Arial, sans-serif"
                        }
                    }
                },
                series: this.getYAxis(),/*[{                    
                    name: 'Tokyo',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                    name: 'New York',
                    data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                }]*/
            });

        },
       
        getXAxis: function () {
            var xAxis = [];

            for (var i = 0, len = this.einstein.length; i < len && this.einstein != "garbage"; i++) {
                xAxis.push(this.einstein[i].DimensionValues[0].Value);
            }
            
            return xAxis;
        },

        getYAxis: function() {
            var yAxis = [];

            if (this.einstein != "garbage" && this.selectedMetricsNames) {
                for (var i = 0, lenMetrics = this.selectedMetricsNames.length; i < lenMetrics; i++) {
                    var metricValues = [];

                    var name = this.selectedMetricsNames[i];

                    for (var j = 0, lenEinst = this.einstein.length; j < lenEinst; j++) {
                        metricValues.push(parseInt(this.einstein[j].MetricValues[i].Value));
                    }

                    yAxis.push({ name: name, data: metricValues });
                }
            }

            return yAxis;
        }

    });

    return HighchartsTimelineView;
});