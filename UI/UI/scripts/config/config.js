define('Config', [
], function () {
    var Config = {
        ComponentSettings: {
<<<<<<< HEAD
<<<<<<< HEAD
            ComponentURL: "http://37.157.0.42:33895/api/ReportComponent",
            ReportURL: "http://37.157.0.42:33895/api/ReportComponent"
        },

        ReportSettings: {
            ComponentURL: "http://37.157.0.42:33895/api/ReportComponent",
            ReportURL: "http://37.157.0.42:33895/api/ReportComponent"
        },
=======
=======
>>>>>>> a680b101fdc86ebb544f3e994937332453256c37
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
<<<<<<< HEAD
>>>>>>> origin/MetricComponent
=======
>>>>>>> a680b101fdc86ebb544f3e994937332453256c37
    };

    return Config;
});