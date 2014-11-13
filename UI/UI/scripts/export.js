define('Export', [
    'jquery',
    'underscore',
    'Kinvey',
    'backbone'
], function ($, _, Kinvey, Backbone) {
    var Export = {

        exportCsv: function (data) {
            console.log("IM HERE AT EXPORT",  JSON.stringify(data));
            $.ajax({
                url: 'http://172.22.3.236:33894/api/Export',
                //data: JSON.stringify(data),
                //contentType: 'application/json',
                type: 'GET',
                success: function (response) {
                    console.log(response);
                    var promise = Kinvey.File.download(response + "", {
                        ttl     : 7200,// Two hours
                        success : function(file) {
                            console.log(file);
                        }
                    });
                },
                error: function() {
                    console.log("fail");
                }
            });
        }
    };
    return Export;
});