using Aspose.Cells;

namespace BussinessLogic.Handlers.ExportHandlers.Type_Specific_Logic
{
    internal class XlsExport
    {
        public Workbook KpiToXls(Workbook workbook, int i)
        {
            var worksheet = workbook.Worksheets[0];
            var cells = worksheet.Cells;
            return null;
        }
    }
}
