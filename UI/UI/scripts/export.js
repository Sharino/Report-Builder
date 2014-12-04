define('Export', [
    'jquery',
    'underscore',
    'backbone',
    'Config',
    'adform-notifications'
], function ($, _, Backbone, Config) {
    var Export = {
        dashboardToCsv: function (data, opt) {
            console.log(data);
            $.ajax({
                url: Config.ExportSettings.DashboardToCsv,
                data: JSON.stringify(data),
                contentType: 'application/json',
                type: 'POST',
                success: function (data, status, jqXHR) {
                    if (opt.success != null) {
                        opt.success(data, status, jqXHR);
                    }
                }
            });
        },

        exportCsv: function (data, opt) {
            $.ajax({
                url: Config.ExportSettings.KpiToCSV,
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
        },

        exportXls: function (data, opt) {
            $.ajax({
                url: Config.ExportSettings.KpiToXLS,
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