define('Config', [
], function () {
    var baseUrl = "http://37.157.0.42:33895/api/";
    var einsteinUrl = "http://37.157.0.42:33896/api/";
    //var einsteinUrl = "http://localhost:5000/api/";

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
            URL: einsteinUrl + "Einstein/Data"
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
            KpiToXLS: baseUrl + "Export/KpiToXls",
            DashboardToCsv: baseUrl + "Export/DashboardToCsv"
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
    };

    return Config;
});