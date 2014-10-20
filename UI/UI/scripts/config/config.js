define('Config', [
], function () {
    var Config = {
        ComponentSettings: {
            URL: "http://37.157.0.42:33895/api/ReportComponent",
        },

        ReportSettings: {
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

        MenuSettings: {
            items:[
                {
                    link: "#report",
                    title: "My Report",
                    position: "right"
                },
                {
                    link: "#create",
                    title: "Create new"
                },
                {
                    link: "#list",
                    title: "List"
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