define('HighchartsTimelineView', [
    'BaseCompositeView',
    'Highcharts',
], function (BaseCompositeView, Highcharts) {
    var HighchartsTimelineView = BaseCompositeView.extend({

        initialize: function (options) {
            this.options = options;
            //this.render(options);
        },

        render: function (options) {
            var einstein;
            if (!options) {
                einstein = this.options;
            } else {
                einstein = options;
            }

            console.log("Einstux: ", einstein);

            this.$el.highcharts({
                title: {
                    text: this.model.get("Title"),
                    x: -20 //center
                },
                xAxis: {
                    //categories: einstein.einstein.DimensionValues//this.prepareData(einstein).days
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                yAxis: {
                    title: {
                        text: 'Temperature (°C)'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: '°C'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    //data: einstein.einstein.MetricValues//this.prepareData(einstein).seriesData
                    
                    name: 'Tokyo',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                    name: 'New York',
                    data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                }, {
                    name: 'Berlin',
                    data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
                }, {
                    name: 'London',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                }]
            });

        },

        //prepareData: function (einstein) {
        //    einstein = einstein.einstein;
        //    console.log("Gautas EINSTEINS: ", einstein);
        //    console.log("lengthas: ", einstein.length);
        //    var data = {
        //        days: [],
        //        seriesData: [],
        //    };

        //    for (var i = 0, einstLen = einstein.length; i < einstLen; i++) {
        //        var metrics = [];
        //        var day = [];
        //        data.days.push(einstein[i].DimensionValues[0].Value);

        //        console.log("EINSTEUKO metricValues: ", einstein[i].MetricValues);

        //        for (var j = 0, metricLen = einstein[i].MetricValues.length; j < metricLen; j++) {
        //            metrics.push(einstein[i].MetricValues[j].Value);
        //        }

        //        day.push(metrics);
        //        data.push(day);
        //    }

        //    console.log("SUp data: ", data);
        //    return data;
        //},

    });

    return HighchartsTimelineView;
});