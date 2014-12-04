using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using BussinessLogic.Handlers.ExportHandlers;
using Models.Models;

namespace Controllers.Controllers
{
	[EnableCors(origins: "*", headers: "*", methods: "*")]
	public class ExportController : ApiController
	{
		[HttpPost]
        public HttpResponseMessage KpiToCsv(ExportRequest request, string separator = ",")
		{
			if (request != null)
				if (request.Values.Count > 0)
				{
				    var handler = new KpiToCsvHandler();
                    var fileName = handler.HandleCore(request, separator);

				    if (handler.Errors != null && handler.Errors.Count > 0)
				    {
				        return Request.CreateResponse(HttpStatusCode.BadRequest, handler.Errors);
				    }
				    return Request.CreateResponse(HttpStatusCode.OK, ConfigurationManager.AppSettings["exportsLocation"] + fileName);
				}
			return Request.CreateResponse(HttpStatusCode.BadRequest);
		}

		[HttpPost]
		public HttpResponseMessage KpiToPdf(ExportRequest request)
		{
			if (request != null)
			{
				if (request.Values.Count > 0)
				{
				    var handler = new KpiToPdfHandler();
				    var fileName = handler.HandleCore(request);

                    if (handler.Errors != null && handler.Errors.Count > 0)
                    {
                        return Request.CreateResponse(HttpStatusCode.BadRequest, handler.Errors);
                    }
					return Request.CreateResponse(HttpStatusCode.OK, ConfigurationManager.AppSettings["exportsLocation"] + fileName);
				}
			}
			return Request.CreateResponse(HttpStatusCode.BadRequest);
		}

        [HttpPost]
        public HttpResponseMessage KpiToXls(ExportRequest request)
        {
            if (request != null)
            {
                if (request.Values.Count > 0)
                {
                    var handler = new KpiToXlsHandler();
                    var fileName = handler.HandleCore(request);

                    if (handler.Errors != null && handler.Errors.Count > 0)
                    {
                        return Request.CreateResponse(HttpStatusCode.BadRequest, handler.Errors);
                    }
                    return Request.CreateResponse(HttpStatusCode.OK, ConfigurationManager.AppSettings["exportsLocation"] + fileName);
                }
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

	    [HttpPost]
	    public HttpResponseMessage DashboardtoCsv(List<ExportRequest> request)
	    {
	        return null;
	    }
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