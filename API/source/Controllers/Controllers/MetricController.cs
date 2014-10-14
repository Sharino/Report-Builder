using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using BussinessLogic.Handlers.MetricHandlers;
using Contracts.DTO;

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
            if (response != null)
            {
                if (response.MetricDtos != null)
                {
                    IEnumerable<MetricDto> metricDtos = response.MetricDtos;
                    return Request.CreateResponse(HttpStatusCode.OK, metricDtos);
                }
                return Request.CreateResponse(HttpStatusCode.NoContent, response.Errors);
            }
            return Request.CreateResponse(HttpStatusCode.NoContent);
        }

        [HttpGet]
        public HttpResponseMessage Get(int id)
        {
            var handler = new MetricGetHandler();
            var response = handler.Handle(id);
            if (response != null)
            {
                if (response.MetricDtos != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, response.MetricDtos[0]);
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, response.Errors);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }
    }
}
