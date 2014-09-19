using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Report_Builder.Models;
using System.Net.Http;
using System.Net;


namespace Report_Builder.Controllers
{
    public class ReportController : ApiController
    {
        public HttpResponseMessage GetAll()
        {
            var TemporaryList = new List<Report>()
            {
                new Report(){ReportId = 1, Title = "GetAll : First Report"},
                new Report(){ReportId = 2, Title = "GetAll : Second Report"}
            };

			return Request.CreateResponse(HttpStatusCode.OK, new { data = TemporaryList });
        }
    }
}
