define('Export', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var Export = {

        // Seip pamascius, reiktu tokius velnius sudet i Component modeli, kur butu Component.exportCsv(), Component.exportPdf()
        // Kad automatiskai is modelio pasiimtu einsteinData ir pustu i CSV/PDF // Tony

        exportCsv: function (data) {
            $.ajax({
                url: 'http://localhost:5000/api/Export/KpiToCsv',
                data: JSON.stringify(data),
                contentType: 'application/json',
                type: 'POST',
                success: function (data, status, jqXHR) {
                    console.log(data, jqXHR);
                    console.log(jqXHR.getResponseHeader("Content-Disposition"));
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("fail", this);
                }
            });
        },

        exportPdf: function (data, opt) {
            $.ajax({
                url: 'http://localhost:5000/api/Export/KpiToPdf',
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