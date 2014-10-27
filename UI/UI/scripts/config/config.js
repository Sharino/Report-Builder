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
        NotificationSettings: {
            Timeout: 5000
        },
        NetworkSettings:{
            Timeout: 5000
        },
        ErrorSettings: {
            ErrorMessages: {
                NoResponse: "Server did not respond."
            }
        }
    };

    return Config;
});