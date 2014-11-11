using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Controllers.Controllers
{
    public class ExportController : ApiController
    {
        //[HttpGet]
        //public HttpResponseMessage GetFile(string id)
        //{
        //    string fileName = @"2014-11-10 02;23-CSV.csv";
        //    string localFilePath = @"C:\Report Builder\2014-11-10 02;23-CSV.csv";
        //    int fileSize;

        //  //  localFilePath = getFileFromID(id, out fileName, out fileSize);

        //    HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
        //    response.Content = new StreamContent(new FileStream(localFilePath, FileMode.Open, FileAccess.Read));
        //    response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
        //    response.Content.Headers.ContentDisposition.FileName = fileName;

        //    return response;
        //}

        [HttpPost]
        public HttpResponseMessage ExportToCsv(List<Request> requests, string separator = ", ")
        {
            string header = "Date";
            var headerList = new List<string>();
            string content = "";

            foreach (var req in requests)
            {
                content += req.Date;
                foreach (var val in req.Values)
                {
                    if (!headerList.Contains(val.Mnemonic))
                        headerList.Add(val.Mnemonic);
                    content += separator + val.Value;
                }
                content += "\n";
            }
            header = headerList.Aggregate(header, (current, mnemonic) => current + (separator + mnemonic));

            Random random = new Random();
            int randomNumber = random.Next(100, 7777);

            string fileName = DateTime.UtcNow.ToString("yyyy-M-d") + " - " + randomNumber + "-CSV.csv";
            string filePath = @"C:\Report Builder\" + fileName;


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
            response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            response.Content.Headers.ContentDisposition.FileName = fileName;

            return response;
        }
    }

    public class Values
    {
        public string Mnemonic { get; set; }
        public string Value { get; set; }
    }

    public class Request
    {
        public List<Values> Values { get; set; }
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