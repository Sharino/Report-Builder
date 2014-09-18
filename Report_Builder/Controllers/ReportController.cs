using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Report_Builder.Models;

namespace Report_Builder.Controllers
{
    public class ReportController : ApiController
    {
        public IEnumerable<Report> GetAll()
        {
            var TemporaryList = new List<Report>()
            {
                new Report(){ReportId = 1, Title = "GetAll : First Report"},
                new Report(){ReportId = 2, Title = "GetAll : Second Report"}
            };

            return TemporaryList;
        }
    }
}
