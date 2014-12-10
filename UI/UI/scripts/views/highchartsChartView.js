define('HighchartsChartView', [
    'BaseCompositeView',
    'Highcharts',
    'HighchartsTheme'
], function (BaseCompositeView) {
    var HighchartsChartView = BaseCompositeView.extend({

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

            var yAxisData = this.getYAxisData();
            var xAxisData = this.getXAxisData();

            var yAxis = [];
            yAxis.push(this.setYAxis(0, yAxisData.length, this.getMaxValue(yAxisData[0])));
            if (yAxisData.length > 1) {
                yAxis.push(this.setYAxis(1, yAxisData.length, this.getMaxValue(yAxisData[1])));
            }

            this.$el.highcharts({
                chart: {
                    type: 'bar',
                    marginLeft: 100,
                },
                title: {
                    text: null,
                },
                xAxis: {
                    gridLineColor: '#cbe5f5',
                    lineColor: '#cbe5f5',
                    categories: xAxisData,
                    labels: {
                        staggerLines: 1,
                        // y: 20,
                        style: {
                            'font-family': "Open Sans, Helvetica Neue, Helvetica, Arial, sans-serif"
                        }
                    },
                    tickLength: 0,
                    minPadding: 12,
                    maxPadding: 24,
                },
                yAxis: yAxis,
                series: yAxisData,
                /*[{                    
                    name: 'Tokyo',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                    name: 'New York',
                    data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                }]*/
            });

            //this.$el.highcharts.yAxis = yAxis;

        },
        getXAxisData: function () {
            var xAxis = [];
            var data = this.einstein.ComponentValues;

            for (var i = 0, len = data.length; i < len; i++) {
                xAxis.push(data[i].DimensionValues[0].Value);
            }

            return xAxis;
        },

        getYAxisData: function () {
            var yAxis = [];
            var data = this.einstein.ComponentValues;

            if (this.selectedMetricsNames) {
                for (var i = 0, lenMetrics = this.selectedMetricsNames.length; i < lenMetrics; i++) {
                    var metricValues = [];

                    var name = this.selectedMetricsNames[i];

                    for (var j = 0, lenEinst = data.length; j < lenEinst; j++) {
                        metricValues.push(parseInt(data[j].MetricValues[i].Value));
                    }

                    yAxis.push({
                        name: name,
                        data: metricValues,
                        yAxis: i === 0 ? 0 : 1,
                        marker: Highcharts.getOptions().markers[i],
                    });
                }
            }

            return yAxis;
        },

        setYAxis: function (isSecondAxis, dataLength, maxValue) {
            var yAxis = {
                title: {
                    text: null,
                },
                showFirstLabel: true,
                plotOptions: {

                    bar: {
                        value: 0,
                        width: 1,
                        color: '#cbe5f5',
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                minPadding: dataLength > 1 ? 1 : 0,
                maxPadding: dataLength > 1 ? 1 : null,
                gridLineColor: '#cbe5f5',
                lineColor: '#cbe5f5',
                labels: {
                    align: 'center',
                    x: 0,//isSecondAxis ? 10 : -15,
                    y: isSecondAxis ? -10 : 15,
                    style: {
                        'color': Highcharts.getOptions().colors[isSecondAxis],
                        'font-family': "Open Sans, Helvetica Neue, Helvetica, Arial, sans-serif"
                    }
                },
                opposite: isSecondAxis,
                max: maxValue
            };
            return yAxis;
        },

        getMaxValue: function (obj) {
            var maxValue = 0;

            for (var i = 0, len = obj.data.length; i < len; i++) {
                if (obj.data[i] > maxValue) {
                    maxValue = obj.data[i];
                }
            }

            return maxValue;
        }

    });

    return HighchartsChartView;
});