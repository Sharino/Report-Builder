define('Export', [
    'jquery',
    'underscore',
    'Kinvey',
    'backbone'
], function ($, _, Kinvey, Backbone) {
    var Export = {

        exportCsv: function (data) {
            $.ajax({
                url: 'http://172.22.22.33:33894/api/Export',
                data: JSON.stringify(data),
                contentType: 'application/json',
                type: 'POST',
                success: function (dlUrl) {
                    window.location.assign(dlUrl);
                },
                error: function () {

                }
            });
        }
    };
    return Export;
});