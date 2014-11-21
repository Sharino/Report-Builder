using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using Aspose.Cells;
using Aspose.Pdf;
using Aspose.Pdf.Text;

namespace Controllers.Controllers
{
	[EnableCors(origins: "*", headers: "*", methods: "*")]
	public class ExportController : ApiController
	{
		[HttpPost]
		public HttpResponseMessage KpiToCsv(List<Values> request, string separator = ",")
		{
			if (request != null)
				if (request.Count > 0)
				{
					string header = "";
					string content = "";

					Random random = new Random();
					int randomNumber = random.Next(100, 10000);

					foreach (var val in request)
					{
						header += val.Key + separator;
						content += val.Value + separator;
					}
					header = header.TrimEnd(separator.ToCharArray());
					content = content.TrimEnd(separator.ToCharArray());

					string fileName = DateTime.UtcNow.ToString("yyyy-M-d") + "-" + randomNumber + ".csv";

					string filePath = ConfigurationManager.AppSettings["exportsFilePath"] + fileName;

					using (var fs = new FileStream(filePath, FileMode.Append, FileAccess.Write))
					using (var sw = new StreamWriter(fs))
					{
						sw.WriteLine(header);
						sw.Write(content);
						sw.Close();
						fs.Close();
					}
					return Request.CreateResponse(HttpStatusCode.OK, ConfigurationManager.AppSettings["exportsLocation"] + fileName);
				}
			return Request.CreateResponse(HttpStatusCode.BadRequest);
		}

		[HttpPost]
		public HttpResponseMessage KpiToPdf(List<Values> request)
		{
			if (request != null)
			{
				if (request.Count > 0)
				{
					var document = new Document();
					document.PageInfo.Margin.Left = 40;
					document.PageInfo.Margin.Right = 40;

					var page = document.Pages.Add();

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

					for (int i = 0; i < request.Count; i++)
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

						keyRow.Cells.Add(request[i].Key);
						valueRow.Cells.Add(request[i].Value);
					}

					page.Paragraphs.Add(table);

					string fileName = DateTime.UtcNow.ToString("yyyy-M-d") + "-" + document.GetHashCode() + ".pdf";

					document.Save(ConfigurationManager.AppSettings["exportsFilePath"] + fileName);


					return Request.CreateResponse(HttpStatusCode.OK, ConfigurationManager.AppSettings["exportsLocation"] + fileName);
				}
			}
			return Request.CreateResponse(HttpStatusCode.BadRequest);
		}

		[HttpPost]
		public HttpResponseMessage KpiToXls(List<Values> request)
		{
			if (request != null)
			{
				if (request.Count > 0)
				{
					var workbook = new Workbook();
					var worksheet = workbook.Worksheets[0];

					var cells = worksheet.Cells;
					var row = 1;
					var col = 1;

					worksheet.AutoFitRow(row);
					worksheet.AutoFitRow(row + 1);

					var cellStyle = new Style { Number = 0, Pattern = BackgroundType.Solid, ForegroundColor = System.Drawing.Color.FromArgb(255, 240, 252, 255) };
					var borderColor = System.Drawing.Color.FromArgb(255, 202, 230, 236);

					cellStyle.Borders[BorderType.LeftBorder].LineStyle = CellBorderType.Medium;
					cellStyle.Borders[BorderType.RightBorder].LineStyle = CellBorderType.Medium;


					cellStyle.Borders.SetColor(borderColor);


					foreach (var req in request)
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
					
					var fileName = DateTime.UtcNow.ToString("yyyy-M-d") + "-" + workbook.GetHashCode() + ".xls";

					workbook.Save(ConfigurationManager.AppSettings["exportsFilePath"] + fileName);

					return Request.CreateResponse(HttpStatusCode.OK, ConfigurationManager.AppSettings["exportsLocation"] + fileName);
				}
			}

			return Request.CreateResponse(HttpStatusCode.BadRequest);
		}

	}

	public class Values
	{
		public string Key { get; set; }
		public string Value { get; set; }
	}

	public class Request
	{
		public List<Values> ComponentValues { get; set; }
		public string Date { get; set; }
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