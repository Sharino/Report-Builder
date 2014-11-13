define('Export', [
    'jquery',
    'underscore',
    'Kinvey',
    'backbone'
], function ($, _, Kinvey, Backbone) {
    var Export = {

        exportCsv: function (data) {
            $.ajax({
                url: 'http://37.157.0.42:33895/api/Export',
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