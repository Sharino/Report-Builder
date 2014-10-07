using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BussinessLogic.Handlers.MetricHandlers;
using Contracts.DTO;
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
            var handler = new MetricGetAllHandler();
            var response = handler.Handle(0);
            if (response.MetricDtos != null)
            {
                IEnumerable<MetricDTO> metricDtos = response.MetricDtos;
                return Request.CreateResponse(HttpStatusCode.OK, metricDtos);
            }
            return Request.CreateResponse(HttpStatusCode.NoContent, response.Errors);
        }

        [HttpGet]
        public HttpResponseMessage Get(int id)
        {
            var handler = new MetricGetHandler();
            var response = handler.Handle(id);
            if (response.MetricDtos != null)
            {
                return Request.CreateResponse(HttpStatusCode.OK, response.MetricDtos[0]);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, response.Errors);
        }
    }
}
