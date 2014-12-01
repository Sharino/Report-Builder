define('Config', [
], function () {
    var baseUrl = "http://37.157.0.42:33895/api/";
    var einsteinUrl = "http://37.157.0.42:33896/api/";

    var Config = {
        ComponentSettings: {
            URL: baseUrl + "ReportComponent"
        },

        DashboardSettings: {
            URL: baseUrl + "Dashboard"
        },

        DashboardComponentSettings: {
            URL: baseUrl + "DashboardComponent"
        },

        MetricSettings: {
            URL: baseUrl + "Metric"
        },

        EinsteinSettings: {
            URL: einsteinUrl + "Einstein"
        },

        DimensionSettings: {
            URL: baseUrl + "Dimension"
        },

        MetricDimensionMap: {
            URL: baseUrl + "MetricDimensionMap",
        },

        ExportSettings: {
            KpiToCSV: baseUrl + "Export/KpiToCsv",
            KpiToPDF: baseUrl + "Export/KpiToPdf",
            KpiToXLS: baseUrl + "Export/KpiToXls"
        },


        NotificationSettings: {
            Timeout: 1500
        },

        NetworkSettings: {
            Timeout: 5000
        },

        MenuSettings: {
            items: [
                {
                    link: "#dashboards",
                    title: "Dashboards",
                },
                {
                    link: "#list",
                    title: "Components"
                }
            ]
        },

        ErrorSettings: {
            ErrorMessages: {
                NoResponse: "Server did not respond."
            }
        },

        getMap: function () {
            var self = this;
            $.ajax({
                url: baseUrl + "MetricDimensionMap",
                contentType: 'application/json',
                type: 'GET',
                success: function (response) {
                    self.map = response;
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
            if (this.metricView && this.dimensionView && this.map) {
                var array = this.dimensionView.dimensionArray;
                var dimensionMap = this.map.DimensionMappings;
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
            if (this.metricView && this.dimensionView && this.map) {
                var array = this.metricView.metricArray;
                var metricMap = this.map.MetricMappings;
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

    return Config;
});