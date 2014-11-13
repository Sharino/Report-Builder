define('Export', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var Export = {

        exportCsv: function (data) {
            console.log("IM HERE AT EXPORT",  JSON.stringify(data));
            $.ajax({
                url: 'http://172.22.22.33:33894/api/Export',
                //data: JSON.stringify(data),
                //contentType: 'application/json',
                type: 'GET',
                success: function (response) {
                    console.log(response);
                    console.log("success");
                },
                error: function() {
                    console.log("fail");
                }
            });
        }
    };
    return Export;
});