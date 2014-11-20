using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using BussinessLogic.Handlers.MetricDimensionMapHandlers;

namespace Controllers.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class MetricDimensionMapController : ApiController
    {
        [HttpGet]
        public HttpResponseMessage Get()
        {
            var handler = new MetricDimensionMapGetHandler();
            var response = handler.HandleCore();
            if (handler.Errors == null || handler.Errors.Count < 1)
            {
                return Request.CreateResponse(HttpStatusCode.OK, response);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, handler.Errors);
        }
    }
}
