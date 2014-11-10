define('Config', [
], function () {
    var Config = {
        ComponentSettings: {
            URL: "http://172.22.3.236:33894/api/reportComponent"
        },
        ReportSettings: {
            URL: "http://172.22.3.236:33894/api/reportComponent"
        },
        DashboardSettings: {
            URL: "http://172.22.3.236:33894/api/dashboard"
        },
        DashboardComponentSettings: {
            URL: "http://172.22.3.236:33894/api/dashboardcomponent"
        },
        MetricSettings: {
            URL: "http://172.22.3.236:33894/api/Metric"
        },
        DimensionSettings: {//FIX WHEN BACK-END IS AVAILABLE
            URL: "http://172.22.3.236:33894/api/Dimension"
        },

        NotificationSettings: {
            Timeout: 5000
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