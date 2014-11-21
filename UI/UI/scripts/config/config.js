define('Config', [
], function () {
    //TODO using configą, pagal mode žiūrėt
    var baseUrl = "http://37.157.0.42:33895/api/";
    var baseUrl = "http://localhost:33894/api/";
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
                    link: "#list",
                    title: "Components"
                },
                {
                    link: "#dashboards",
                    title: "Dashboards",
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
                url: "http://localhost:33894/api/MetricDimensionMap",
                contentType: 'application/json',
                type: 'GET',
                success: function (response) {
                    self.map = response;
                },
                error: function () {
                    $.notifications.display({
                        type: 'error',
                        content: "Critical error. PRESS ALT + F4",
                        timeout: Config.NotificationSettings.Timeout
                    });
                }
            });
        },

    };

    return Config;
});