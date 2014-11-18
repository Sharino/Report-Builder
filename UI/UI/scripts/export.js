define('Export', [
    'jquery',
    'underscore',
    'backbone',
    'Config',
    'adform-notifications'
], function ($, _, Backbone, Config) {
    var Export = {

        // Seip pamascius, reiktu tokius velnius sudet i Component modeli, kur butu Component.exportCsv(), Component.exportPdf()
        // Kad automatiskai is modelio pasiimtu einsteinData ir pustu i CSV/PDF // Tony

        // Butu gerai kad exportinti būt galima ir dashboard componentus ir report componentus, todėl į modelius kišti nepanorau // mikoloj

        exportCsv: function (data) {
            $.ajax({
                url: Config.ExportSettings.KpiToCSV,
                data: JSON.stringify(data),
                contentType: 'application/json',
                type: 'POST',
                success: function(dlUrl) {
                    window.location.assign(dlUrl);
                },
                error: function() {
                    $.notifications.display({
                        type: 'error',
                        content: "Unable to export component data",
                        timeout: Config.NotificationSettings.Timeout
                    });
                }
            });
        },

        exportPdf: function (data, opt) {
            $.ajax({
                url: Config.ExportSettings.KpiToPDF,
                data: JSON.stringify(data),
                contentType: 'application/json',
                type: 'POST',
                success: function (data, status, jqXHR) {
                    if (opt.success != null) {
                        opt.success(data, status, jqXHR);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    if (opt.error != null) {
                        opt.error(xhr, ajaxOptions, thrownError);
                    }
                }
            });
        }
    };
    return Export;
});