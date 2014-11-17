using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Web.Http.Cors;
using Aspose.Pdf;
using Aspose.Pdf.Text;
using BorderInfo = Aspose.Pdf.BorderInfo;
using BorderSide = Aspose.Pdf.BorderSide;
using Color = Aspose.Pdf.Color;
using MarginInfo = Aspose.Pdf.MarginInfo;
using Row = Aspose.Pdf.Row;
using Table = Aspose.Pdf.Table;

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

                    string fileName = DateTime.UtcNow.ToString("yyyy-M-d") + "-" + randomNumber + ".csv";
                    string filePath = @"C:\Report Builder\Exports\" + fileName;

                    foreach (var val in request)
                    {
                        header += val.Key + separator;
                        content += val.Value + separator;
                    }
                    header = header.TrimEnd(separator.ToCharArray());
                    content = content.TrimEnd(separator.ToCharArray());

                    using (var fs = new FileStream(filePath, FileMode.Append, FileAccess.Write))
                    using (var sw = new StreamWriter(fs))
                    {
                        sw.WriteLine(header);
                        sw.Write(content);
                        sw.Close();
                        fs.Close();
                    }
                    HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                    response.Content = new StreamContent(new FileStream(filePath, FileMode.Open, FileAccess.Read));
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.ContentDisposition.FileName = fileName;
                    return response;
                }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

		[HttpPost]
		public string KpiToPdf(List<Values> request)
		{
			if (request != null)
				if (request.Count > 0)
				{
					Random random = new Random();
					int randomNumber = random.Next(100, 10000);

					string fileName = DateTime.UtcNow.ToString("yyyy-M-d") + "-" + randomNumber + ".pdf";
					string filePath = @"C:\Report Builder\Exports\";

					Document doc = new Document();
					doc.PageInfo.Margin.Left = 40;
					doc.PageInfo.Margin.Right = 40;

					Page a = doc.Pages.Add();

					// Initializes a new instance of the Table
					Table table = new Table
					{
						DefaultColumnWidth = "127",
						Border = new BorderInfo(BorderSide.All, .5f, Color.FromRgb(System.Drawing.Color.FromArgb(1, 202, 230, 236))),
						BackgroundColor = Color.FromRgb(System.Drawing.Color.FromArgb(1, 240, 252, 255)),
						DefaultCellBorder = new BorderInfo(BorderSide.Right, .5f, Color.FromRgb(System.Drawing.Color.FromArgb(1, 202, 230, 236)))
					};

					Row keyRow = table.Rows.Add();
					keyRow.DefaultCellPadding = new MarginInfo(10, 0, 5, 5);

					Row valueRow = table.Rows.Add();
					valueRow.DefaultCellPadding = new MarginInfo(10, 5, 5, 2);

					for (int i = 0; i < request.Count; i++)
					{
						if (i%4 == 0 && i != 0)
						{
							a.Paragraphs.Add(table);
							a.Paragraphs.Add(new TextFragment());

							table = new Table
							{
								DefaultColumnWidth = "127",
								Border = new BorderInfo(BorderSide.All, .5f, Color.FromRgb(System.Drawing.Color.FromArgb(1, 202, 230, 236))),
								BackgroundColor = Color.FromRgb(System.Drawing.Color.FromArgb(1, 240, 252, 255)),
								DefaultCellBorder = new BorderInfo(BorderSide.Right, .5f, Color.FromRgb(System.Drawing.Color.FromArgb(1, 202, 230, 236)))
							};
							
							keyRow = table.Rows.Add();
							valueRow = table.Rows.Add();

							keyRow.DefaultCellPadding = new MarginInfo(10, 0, 5, 5);
							valueRow.DefaultCellPadding = new MarginInfo(10, 5, 5, 2);
						}

						keyRow.Cells.Add(request[i].Key);
						valueRow.Cells.Add(request[i].Value);
					}

					a.Paragraphs.Add(table);

					doc.Save(filePath + fileName);

					return "http://37.157.0.42//Exports//" + fileName;            
				}
			return "";
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


/*
 [
  {
    "Values": [
      {
        "Mnemonic": "Clicks",
        "Value": "164"
      },
      {
        "Mnemonic": "Impressions",
        "Value": "1575"
      },
      {
        "Mnemonic": "CPR",
        "Value": "12%"
      }
    ],
    "Date": "01/09/2014"
  },
  {
    "Values": [
      {
        "Mnemonic": "Clicks",
        "Value": "10"
      },
      {
        "Mnemonic": "Impressions",
        "Value": "123"
      },
      {
        "Mnemonic": "CPR",
        "Value": "9%"
      }
    ],
    "Date": "02/09/2014"
  },
  {
    "Values": [
      {
        "Mnemonic": "Clicks",
        "Value": "37"
      },
      {
        "Mnemonic": "Impressions",
        "Value": "576"
      },
      {
        "Mnemonic": "CPR",
        "Value": "5%"
      }
    ],
    "Date": "03/09/2014"
  },
]
 */

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