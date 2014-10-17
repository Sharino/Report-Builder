define('Config', [
], function () {
    var Config = {
        ComponentSettings: {
            URL: "http://37.157.0.42:33895/api/ReportComponent",
        },

        ReportSettings: {
            URL: "http://172.22.19.97:33894/api/reportComponent"
        },
        DashboardSettings: {
            URL: "http://172.22.19.97:33894/api/dashboard"
        },
        DashboardComponentSettings: {
            URL: "http://172.22.19.97:33894/api/dashboardcomponent"
        },
        MetricSettings: {
            URL: "http://172.22.19.97:33894/api/Metric"
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