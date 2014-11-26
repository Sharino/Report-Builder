using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using System.Web.Http.Cors;
using Aspose.Pdf;
using Aspose.Pdf.Text;
using Table = Aspose.Pdf.Table;

namespace Controllers.Controllers
{
	[EnableCors(origins: "*", headers: "*", methods: "*")]
	public class ExportController : ApiController
	{
		[HttpPost]
		public HttpResponseMessage KpiToCsv(Request request, string separator = ",")
		{
			if (request != null)
				if (request.Values.Count > 0)
				{
					var generatedDate = new StringBuilder(request.GeneratedDate);
					var dates = new StringBuilder(request.StartDate + separator + request.EndDate);
					var header = new StringBuilder();
					var content = new StringBuilder();

					foreach (var val in request.Values)
					{
						header.Append(val.Key + separator);
						content.Append(val.Value + separator);
					}
					header.Remove(header.Length - 1, 1);
					content.Remove(content.Length - 1, 1);

					string fileName = request.Title + "-" + Environment.TickCount + ".csv";

					string filePath = ConfigurationManager.AppSettings["exportsFilePath"] + fileName;

					using (var fs = new FileStream(filePath, FileMode.Append, FileAccess.Write))
					using (var sw = new StreamWriter(fs))
					{
						sw.WriteLine(generatedDate);
						sw.WriteLine(header);
						sw.WriteLine(content);
						sw.WriteLine(dates);
						sw.Close();
						fs.Close();
					}
					return Request.CreateResponse(HttpStatusCode.OK, ConfigurationManager.AppSettings["exportsLocation"] + fileName);
				}
			return Request.CreateResponse(HttpStatusCode.BadRequest);
		}

		[HttpPost]
		public HttpResponseMessage KpiToPdf(Request request)
		{
			if (request != null)
			{
				if (request.Values.Count > 0)
				{
					var document = new Document();
					document.PageInfo.Margin.Left = 40;
					document.PageInfo.Margin.Right = 40;

					var page = document.Pages.Add();

					page.Paragraphs.Add(new TextFragment(request.GeneratedDate) { HorizontalAlignment = HorizontalAlignment.Right });
					page.Paragraphs.Add(new TextFragment());
					page.Paragraphs.Add(new TextFragment(request.StartDate + " - " + request.EndDate) { HorizontalAlignment = HorizontalAlignment.Left });
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


					return Request.CreateResponse(HttpStatusCode.OK, ConfigurationManager.AppSettings["exportsLocation"] + fileName);
				}
			}
			return Request.CreateResponse(HttpStatusCode.BadRequest);
		}

        //[HttpPost]
        //public HttpResponseMessage KpiToXls(Request request)
        //{
        //    if (request != null)
        //    {
        //        if (request.Values.Count > 0)
        //        {
        //            var workbook = new Workbook();
        //            var worksheet = workbook.Worksheets[0];

        //            var cells = worksheet.Cells;

        //            cells[0, 0].PutValue(request.GeneratedDate);
        //            cells[2, 0].PutValue(request.StartDate);
        //            cells[2, 1].PutValue(request.EndDate);

        //            var row = 4;
        //            var col = 0;

        //            worksheet.AutoFitRow(row);
        //            worksheet.AutoFitRow(row + 1);

        //            var cellStyle = new Style { Number = 0, Pattern = BackgroundType.Solid, ForegroundColor = System.Drawing.Color.FromArgb(255, 240, 252, 255) };
        //            var borderColor = System.Drawing.Color.FromArgb(255, 202, 230, 236);

        //            cellStyle.Borders[BorderType.LeftBorder].LineStyle = CellBorderType.Medium;
        //            cellStyle.Borders[BorderType.RightBorder].LineStyle = CellBorderType.Medium;
        //            cellStyle.Borders.SetColor(borderColor);

        //            foreach (var req in request.Values)
        //            {
        //                cellStyle.Borders[BorderType.TopBorder].LineStyle = CellBorderType.Medium;
        //                cellStyle.Borders[BorderType.BottomBorder].LineStyle = CellBorderType.None;

        //                var keyCell = cells[row, col];
        //                keyCell.SetStyle(cellStyle);
        //                keyCell.PutValue(req.Key);

        //                double parsedReqValue;
        //                double.TryParse(req.Value, NumberStyles.Any, CultureInfo.InvariantCulture, out parsedReqValue);

        //                cellStyle.Borders[BorderType.TopBorder].LineStyle = CellBorderType.None;
        //                cellStyle.Borders[BorderType.BottomBorder].LineStyle = CellBorderType.Medium;

        //                var valueCell = cells[row + 1, col];
        //                valueCell.SetStyle(cellStyle);
        //                valueCell.PutValue(parsedReqValue);

        //                col++;
        //            }

        //            worksheet.AutoFitColumns();

        //            var fileName = request.Title + "-" + Environment.TickCount + ".xls";

        //            workbook.Save(ConfigurationManager.AppSettings["exportsFilePath"] + fileName);

        //            return Request.CreateResponse(HttpStatusCode.OK, ConfigurationManager.AppSettings["exportsLocation"] + fileName);
        //        }
        //    }

        //    return Request.CreateResponse(HttpStatusCode.BadRequest);
        //}

	}

	public class Values
	{
		public string Key { get; set; }
		public string Value { get; set; }
	}

	public class Request
	{
		public string Title { get; set; }
		public string StartDate { get; set; }
		public string EndDate { get; set; }
		public string GeneratedDate { get; set; }
		public List<Values> Values { get; set; }
	}
}


//[HttpPost]
//public HttpResponseMessage ExportToCsv(List<Request> requests, string separator = ", ")
//{
//    if (requests != null)
//        if (requests.Count > 0)
//        {
//            string header = "Date";
//            var headerList = new List<string>();
//            string content = "";

//            foreach (var req in requests)
//            {
//                content += req.Date;
//                foreach (var val in req.ComponentValues)
//                {
//                    if (!headerList.Contains(val.Key))
//                        headerList.Add(val.Key);
//                    content += separator + val.Value;
//                }
//                content += "\n";
//            }
//            header = headerList.Aggregate(header, (current, mnemonic) => current + (separator + mnemonic));

//            Random random = new Random();
//            int randomNumber = random.Next(100, 10000);

//            string fileName = DateTime.UtcNow.ToString("yyyy-M-d dd;mm") + " - " + randomNumber + ".csv";
//            string filePath = @"C:\Report Builder\" + fileName;


//            using (var fs = new FileStream(filePath, FileMode.Append, FileAccess.Write))
//            using (var sw = new StreamWriter(fs))
//            {
//                sw.WriteLine(header);
//                sw.Write(content);
//                sw.Close();
//                fs.Close();
//            }
//            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
//            response.Content = new StreamContent(new FileStream(filePath, FileMode.Open, FileAccess.Read));
//            response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
//            response.Content.Headers.ContentDisposition.FileName = fileName;

//            return response;
//        }
//    return Request.CreateResponse(HttpStatusCode.BadRequest);
//}