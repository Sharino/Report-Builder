using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using Aspose.Cells;
using Contracts.DTO;
using Models.Models;

namespace BussinessLogic.Handlers.ExportHandlers
{
    public class KpiToXlsHandler
    {
        public List<ErrorDto> Errors; 
        public string HandleCore(ExportRequest request)
        {
            try
            {
                var workbook = new Workbook();
                var worksheet = workbook.Worksheets[0];

                var cells = worksheet.Cells;

                cells[0, 0].PutValue("Generation");
                cells[0, 1].PutValue(request.GeneratedDate);

                if (!string.IsNullOrEmpty(request.Language))
                {
                    cells[1, 0].PutValue("Language");
                    cells[1, 1].PutValue(request.Language);
                }

                cells[2, 0].PutValue("Period:");
                cells[2, 1].PutValue("From");
                cells[2, 2].PutValue(request.StartDate);
                cells[3, 1].PutValue("To");
                cells[3, 2].PutValue(request.EndDate);
                
                var row = 5;
                var col = 0;

                worksheet.AutoFitRow(row);
                worksheet.AutoFitRow(row + 1);

                var cellStyle = new Style { Number = 0, Pattern = BackgroundType.Solid, ForegroundColor = System.Drawing.Color.FromArgb(255, 240, 252, 255) };
                var borderColor = System.Drawing.Color.FromArgb(255, 202, 230, 236);

                cellStyle.Borders[BorderType.LeftBorder].LineStyle = CellBorderType.Medium;
                cellStyle.Borders[BorderType.RightBorder].LineStyle = CellBorderType.Medium;
                cellStyle.Borders.SetColor(borderColor);

                foreach (var req in request.Values)
                {
                    cellStyle.Borders[BorderType.TopBorder].LineStyle = CellBorderType.Medium;
                    cellStyle.Borders[BorderType.BottomBorder].LineStyle = CellBorderType.None;

                    var keyCell = cells[row, col];
                    keyCell.SetStyle(cellStyle);
                    keyCell.PutValue(req.Key);

                    double parsedReqValue;
                    double.TryParse(req.Value, NumberStyles.Any, CultureInfo.InvariantCulture, out parsedReqValue);

                    cellStyle.Borders[BorderType.TopBorder].LineStyle = CellBorderType.None;
                    cellStyle.Borders[BorderType.BottomBorder].LineStyle = CellBorderType.Medium;

                    var valueCell = cells[row + 1, col];
                    valueCell.SetStyle(cellStyle);
                    valueCell.PutValue(parsedReqValue);

                    col++;
                }

                worksheet.AutoFitColumns();

                var fileName = request.Title + "-" + Environment.TickCount + ".xls";

                workbook.Save(ConfigurationManager.AppSettings["exportsFilePath"] + fileName);

                return fileName;
            }
            catch (Exception)
            {
                Errors = new List<ErrorDto>{new ErrorDto("400", "Unable to export")};
            }
            return "";
        }
    }
}
