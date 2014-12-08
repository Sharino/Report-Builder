using Aspose.Cells;

namespace BussinessLogic.Handlers.ExportHandlers.Type_Specific_Logic
{
    internal class XlsExport
    {
        public Workbook KpiToXls(Workbook workbook, int i)
        {
            var worksheet = workbook.Worksheets[0];
            var cells = worksheet.Cells;

            cells[0, 0].PutValue("Generated on");
//            cells[0, 1].PutValue(request.GeneratedDate);

            return null;
        }
    }
}
