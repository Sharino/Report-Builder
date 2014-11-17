define('Config', [
], function () {
    var Config = {
        ComponentSettings: {
            URL: "http://37.157.0.42:33895/api/reportComponent"
        },
        ReportSettings: {
            URL: "http://37.157.0.42:33895/api/reportComponent"
        },
        DashboardSettings: {
            URL: "http://37.157.0.42:33895/api/dashboard"
        },
        DashboardComponentSettings: {
            URL: "http://37.157.0.42:33895/api/dashboardcomponent"
        },
        MetricSettings: {
            URL: "http://37.157.0.42:33895/api/Metric"
        },
        EinsteinSettings: {
            URL: "http://37.157.0.42:33896/api/Einstein",
            // URL: "http://37.157.0.42:33859/einstein"    
        },
        DimensionSettings: {
            URL: "http://37.157.0.42:33895/api/Dimension"
        },

        ExportSettings: {
            KpiToCSV: "http://37.157.0.42:33895/api/Export/KpiToCsv",
            KpiToPDF: "http://37.157.0.42:33895/api/Export/KpiToPdf"
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