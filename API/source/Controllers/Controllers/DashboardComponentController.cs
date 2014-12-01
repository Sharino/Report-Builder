using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using BussinessLogic.Handlers.Base;
using BussinessLogic.Handlers.DashboardComponentHandlers;
using Contracts.DTO;
using Contracts.Responses;

namespace Controllers.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DashboardComponentController : ApiController
    {
        [HttpPost]
        public HttpResponseMessage Add(int dashboardId, int reportComponentId)
        {
            var handler = new DashboardComponentAddHandler();
            DashboardComponentResponse response = null;
            if (handler.Validate(dashboardId, reportComponentId))
            {
                response = handler.HandleCore(dashboardId, reportComponentId);
            }
            if (handler.Errors == null || handler.Errors.Count < 1)
            {
                if (response != null) return Request.CreateResponse(HttpStatusCode.OK, response.ComponentDtos[0]);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, handler.Errors);
        }

        [HttpGet]
        public HttpResponseMessage Get(int id)
        {
            var handler = new DashboardComponentGetHandler();
            var response = handler.Handle(id);
            if (handler.Errors == null || handler.Errors.Count < 1)
            {
                return Request.CreateResponse(HttpStatusCode.OK, response.ComponentDtos[0]);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, handler.Errors);
        }

        [HttpPut]
        public HttpResponseMessage Update(DashboardComponentDto component)
        {
            var handler = new DashboardComponentUpdateHandler();
            var response = handler.Handle(component);
            if (handler.Errors == null || handler.Errors.Count < 1)
            {
                return Request.CreateResponse(HttpStatusCode.OK, response.ComponentDtos[0]);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, handler.Errors);
        }

        [HttpDelete]
        public HttpResponseMessage Delete(int id)
        {
            var handler = new DashboardComponentDeleteHandler();
            var response = handler.Handle(id);
            if (handler.Errors == null || handler.Errors.Count < 1)
            {
                return Request.CreateResponse(HttpStatusCode.OK, response.ComponentDtos[0]);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, handler.Errors);
        }
    }
}
