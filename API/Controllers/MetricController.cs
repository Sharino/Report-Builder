using System.Net;
using System.Net.Http;
using System.Web.Http;
using Logging;

namespace Controllers
{
    public class MetricController : ApiController
    {
        private Log Log;

        public MetricController()
        {
            
        }

        [HttpGet]
        public HttpResponseMessage GetAll()
        {
            //handler handle
            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        [HttpGet]
        public HttpResponseMessage Get(int id)
        {
            //handler handle
            return new HttpResponseMessage(HttpStatusCode.OK);
        }
    }
}
