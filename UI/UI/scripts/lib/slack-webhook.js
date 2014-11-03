define('SlackWebhook', ['jquery'], function ($) {

    var SlackWebhook = {

        fireHook: function (title, value, colorCode) {
            if (colorCode === "red") {
                colorCode = "#e95e5e";
            }
            if (colorCode === "green") {
                colorCode = "#42b855";
            }
            if (colorCode === "blue") {
                colorCode = "#06a7f0";
            }
            if (colorCode === "yellow") {
                colorCode = "#facb4d";
            }
            

            var data = {
                "attachments": [
                   {
                       "fallback": title,
                       "pretext": title,
                       "color": colorCode || "#eee",
                       "fields": [
                          {
                              "title": title || "",
                              "value": value || "",
                              "short": false
                          }
                       ]
                   }
                ]
            };

            $.ajax({
                url: "https://hooks.slack.com/services/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",
                type: "POST",
                data: JSON.stringify(data),
                crossDomain: true,
                dataType: "json",

                success: function (response) {
                    console.log("OK", response);
                },

                error: function (response) {
                    console.log("FAIL", response);
                }
            });
        }

    };

    return SlackWebhook;

});