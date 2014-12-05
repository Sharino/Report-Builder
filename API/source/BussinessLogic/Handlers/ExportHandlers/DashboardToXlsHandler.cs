using System;
using System.Collections.Generic;
using Aspose.Cells;
using BussinessLogic.Handlers.ExportHandlers.Type_Specific_Logic;
using Contracts.DTO;
using Models.Models;

namespace BussinessLogic.Handlers.ExportHandlers
{
    public class DashboardToXlsHandler
    {
        public List<ErrorDto> Errors;

        public string HandleCore(List<ExportRequest> request)
        {
            try
            {
                var workbook = new Workbook();
                var worksheet = workbook.Worksheets[0];

                var xls = new XlsExport();

                int i = 0;
                foreach (var comp in request)
                {
                    switch (comp.Type)
                    {
                        case 1:
                            workbook = xls.KpiToXls(workbook, i);
                            break;
                    }
                    i += 3;
                }

                xls.KpiToXls();

            }
            catch (Exception exception)
            {
                Errors = new List<ErrorDto> { new ErrorDto("400", "Unable to export") };
            }
        }
    }
}
