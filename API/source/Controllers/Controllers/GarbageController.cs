using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Controllers.Controllers
{
    public class GarbageController : ApiController
    {
        public HttpResponseMessage GetGarbage()
        {
            Random random = new Random();
            return Request.CreateResponse(HttpStatusCode.OK, random.NextDouble());
        }
    }
}
