define('MetricDimensionMap', [
    'jquery',
    'underscore',
    'backbone',
    'Config',
    'adform-notifications'
], function ($, _, Backbone, Config) {

    var map;

    var Map = {
        getMap: function () {
            var self = this;
            $.ajax({
                url: Config.MetricDimensionMap.URL,
                contentType: 'application/json',
                type: 'GET',
                success: function (response) {
                    self.map = response;
                    map = response;
                },
                error: function () {
                    $.notifications.display({
                        type: 'error',
                        content: "Fatal error. Initiate destruction protocol",
                        timeout: Config.NotificationSettings.Timeout
                    });
                }
            });
        },

        calculateMetricMap: function () {
            this.getMap();
            if (this.metricView && this.dimensionView && map) {
                var array = this.dimensionView.dimensionArray;
                var dimensionMap = map.DimensionMappings;
                this.metricIntersection = dimensionMap[0].MetricIds;
                for (var i = 0; i < array.length; i++) {
                    if (array[i].DimensionId != -1) {
                        this.metricIntersection = _.intersection(dimensionMap[array[i].DimensionId - 1].MetricIds, this.metricIntersection);
                    }
                }

                var metrics = this.metricView.allMetrics.toJSON().slice(0);
                var toRemove = [];

                for (var i = 0; i < metrics.length; i++) {
                    if (this.metricIntersection) {
                        var flag = false;
                        for (var j = 0; j < this.metricIntersection.length; j++) {
                            if (metrics[i].MetricId === this.metricIntersection[j]) {
                                flag = false;
                                break;
                            } else {
                                flag = true;
                            }
                        }
                        if (flag === true) {
                            toRemove.push(metrics[i]);
                        }
                    }
                }

                for (var i = 0; i < toRemove.length; i++) {
                    metrics = _.without(metrics, toRemove[i]);
                }
                return metrics;
            }
            return null;
        },

        calculateDimensionMap: function () {
            this.getMap();
            if (this.metricView && this.dimensionView && map) {
                var array = this.metricView.metricArray;
                var metricMap = map.MetricMappings;
                this.dimensionIntersection = metricMap[0].DimensionIds;
                for (var i = 0; i < array.length; i++) {
                    if (array[i].MetricId != -1) {
                        this.dimensionIntersection = _.intersection(metricMap[array[i].MetricId - 1].DimensionIds, this.dimensionIntersection);
                    }
                }

                var dimensions = this.dimensionView.allDimensions.toJSON().slice(0);
                var toRemove = [];

                for (var i = 0; i < dimensions.length; i++) {
                    if (this.dimensionIntersection) {
                        var flag = false;
                        for (var j = 0; j < this.dimensionIntersection.length; j++) {
                            if (dimensions[i].DimensionId === this.dimensionIntersection[j]) {
                                flag = false;
                                break;
                            } else {
                                flag = true;
                            }
                        }
                        if (flag === true) {
                            toRemove.push(dimensions[i]);
                        }
                    }
                }

                for (var i = 0; i < toRemove.length; i++) {
                    dimensions = _.without(dimensions, toRemove[i]);
                }
                return dimensions;
            }
            return null;
        },
    };
    return Map;
});