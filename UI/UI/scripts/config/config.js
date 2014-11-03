define('Config', [
], function () {
    var Config = {
        ComponentSettings: {
            URL: "http://172.22.22.33:33894/api/reportComponent"
        },
        ReportSettings: {
            URL: "http://172.22.22.33:33894/api/reportComponent"
        },
        DashboardSettings: {
            URL: "http://172.22.22.33:33894/api/dashboard"
        },
        DashboardComponentSettings: {
            URL: "http://172.22.22.33:33894/api/dashboardcomponent"
        },
        MetricSettings: {
            URL: "http://172.22.22.33:33894/api/Metric"
        },
        EinsteinSettings: {
            URL: "http://37.157.0.42:33896/api/Einstein/",
            // URL: "http://37.157.0.42:33859/einstein"    
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