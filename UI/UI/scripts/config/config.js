define('Config', [
], function () {
    var Config = {
        ComponentSettings: {
<<<<<<< HEAD
            ComponentURL: "http://37.157.0.42:33895/api/ReportComponent",
            ReportURL: "http://37.157.0.42:33895/api/ReportComponent"
        },

        ReportSettings: {
            ComponentURL: "http://37.157.0.42:33895/api/ReportComponent",
            ReportURL: "http://37.157.0.42:33895/api/ReportComponent"
        },
=======
            //URL: "http://172.22.19.97:33894/api/reportComponent" // Mikalojus Local
            URL: "http://37.157.0.42:33895/api/reportComponent"
        },
        MetricSettings: {
            //URL: "http://172.22.19.97:33894/api/Metric" // Mikalojus Local
            URL: "http://37.157.0.42:33895/api/Metric"
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
>>>>>>> origin/MetricComponent
    };

    return Config;
});