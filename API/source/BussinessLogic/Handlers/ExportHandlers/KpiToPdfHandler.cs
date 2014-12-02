using System;
using System.Collections.Generic;
using System.Configuration;
using Aspose.Pdf;
using Aspose.Pdf.Text;
using Contracts.DTO;
using Models.Models;

namespace BussinessLogic.Handlers.ExportHandlers
{
    public class KpiToPdfHandler
    {
        public List<ErrorDto> Errors;

        public string HandleCore(ExportRequest request)
        {
            try
            {
                var document = new Document();
                document.PageInfo.Margin.Left = 40;
                document.PageInfo.Margin.Right = 40;

                var page = document.Pages.Add();

                page.Paragraphs.Add(new TextFragment("Generated on " + request.GeneratedDate) { HorizontalAlignment = HorizontalAlignment.Right });
                if (!string.IsNullOrEmpty(request.Language))
                {
                    page.Paragraphs.Add(new TextFragment("Language: " + request.Language) {HorizontalAlignment = HorizontalAlignment.Right});
                }
                page.Paragraphs.Add(new TextFragment());
                page.Paragraphs.Add(new TextFragment("From: " + request.StartDate) { HorizontalAlignment = HorizontalAlignment.Left });
                page.Paragraphs.Add(new TextFragment("To: " + request.EndDate) { HorizontalAlignment = HorizontalAlignment.Left });
                page.Paragraphs.Add(new TextFragment());

                var table = new Table
                {
                    DefaultColumnWidth = "127",
                    Border = new BorderInfo(BorderSide.All, .5f, Color.FromRgb(System.Drawing.Color.FromArgb(255, 202, 230, 236))),
                    BackgroundColor = Color.FromRgb(System.Drawing.Color.FromArgb(255, 240, 252, 255)),
                    DefaultCellBorder = new BorderInfo(BorderSide.Right, .5f, Color.FromRgb(System.Drawing.Color.FromArgb(255, 202, 230, 236)))
                };

                var keyRow = table.Rows.Add();
                keyRow.DefaultCellPadding = new MarginInfo(10, 0, 5, 5);

                var valueRow = table.Rows.Add();
                valueRow.DefaultCellPadding = new MarginInfo(10, 5, 5, 2);

                for (int i = 0; i < request.Values.Count; i++)
                {
                    if (i % 4 == 0 && i != 0)
                    {
                        page.Paragraphs.Add(table);
                        page.Paragraphs.Add(new TextFragment());

                        table = new Table
                        {
                            DefaultColumnWidth = "127",
                            Border = new BorderInfo(BorderSide.All, .5f, Color.FromRgb(System.Drawing.Color.FromArgb(255, 202, 230, 236))),
                            BackgroundColor = Color.FromRgb(System.Drawing.Color.FromArgb(255, 240, 252, 255)),
                            DefaultCellBorder = new BorderInfo(BorderSide.Right, .5f, Color.FromRgb(System.Drawing.Color.FromArgb(255, 202, 230, 236)))
                        };

                        keyRow = table.Rows.Add();
                        valueRow = table.Rows.Add();

                        keyRow.DefaultCellPadding = new MarginInfo(10, 0, 5, 5);
                        valueRow.DefaultCellPadding = new MarginInfo(10, 5, 5, 2);
                    }

                    keyRow.Cells.Add(request.Values[i].Key);
                    valueRow.Cells.Add(request.Values[i].Value);
                }

                page.Paragraphs.Add(table);

                string fileName = request.Title + "-" + Environment.TickCount + ".pdf";

                document.Save(ConfigurationManager.AppSettings["exportsFilePath"] + fileName);

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
