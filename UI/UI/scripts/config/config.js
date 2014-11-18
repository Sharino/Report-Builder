define('Config', [
], function () {
    var baseUrl = "http://172.22.22.33:33894/api/";
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

        ExportSettings: {
            KpiToCSV: baseUrl + "Export/KpiToCsv",
            KpiToPDF: baseUrl + "Export/KpiToPdf"
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
        }
    };

    return Config;
});