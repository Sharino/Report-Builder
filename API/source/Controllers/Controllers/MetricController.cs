using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using BussinessLogic.Handlers.MetricHandlers;

namespace Controllers.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class MetricController : ApiController
    {
        [HttpGet]
        public HttpResponseMessage GetAll()
        {
            var handler = new MetricGetAllHandler();
            var response = handler.Handle(0);

            if (handler.Errors == null || handler.Errors.Count < 1)
            {
                return Request.CreateResponse(HttpStatusCode.OK, response.MetricDtos);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, handler.Errors);
        }

        [HttpGet]
        public HttpResponseMessage Get(int id)
        {
            var handler = new MetricGetHandler();
            var response = handler.Handle(id);
            if (handler.Errors == null || handler.Errors.Count < 1)
            {
                return Request.CreateResponse(HttpStatusCode.OK, response.MetricDtos[0]);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, handler.Errors);
        }
    }
}
