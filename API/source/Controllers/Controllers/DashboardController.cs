using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using BussinessLogic.Handlers.DashboardHandlers;
using Contracts.DTO;

namespace Controllers.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DashboardController : ApiController
    {
        [HttpGet]
        public HttpResponseMessage GetAll()
        {
            var handler = new DashboardGetAllHandler();
            var response = handler.Handle(0);
            if (handler.Errors == null || handler.Errors.Count < 1)
            {
                return Request.CreateResponse(HttpStatusCode.OK, response.DashboardDtos);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, handler.Errors);
        }

        [HttpGet]
        public HttpResponseMessage Get(int id)
        {
            var handler = new DashboardGetHandler();
            var response = handler.Handle(id);

            if (handler.Errors == null || handler.Errors.Count < 1)
            {
                return Request.CreateResponse(HttpStatusCode.OK, response.DashboardDtos[0]);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, handler.Errors);
        }

        [HttpPost]
        public HttpResponseMessage Add(DashboardDto dashboardDto)
        {
            var handler = new DashboardAddHandler();
            var response = handler.Handle(dashboardDto);
            if (handler.Errors == null || handler.Errors.Count < 1)
            {
                return Request.CreateResponse(HttpStatusCode.OK, response.DashboardDtos[0]);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, handler.Errors);
        }

        [HttpPut]
        public HttpResponseMessage Update(DashboardDto reportDto)
        {
            var handler = new DashboardUpdateHandler();
            var response = handler.Handle(reportDto);
            if (handler.Errors == null || handler.Errors.Count < 1)
            {
                return Request.CreateResponse(HttpStatusCode.OK, response.DashboardDtos[0]);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, handler.Errors);
        }

        [HttpDelete]
        public HttpResponseMessage Delete(int id)
        {
            var handler = new DashboardDeleteHandler();
            var response = handler.Handle(id);
            if (handler.Errors == null || handler.Errors.Count < 1)
            {
                return Request.CreateResponse(HttpStatusCode.OK, response.DashboardDtos[0]);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, handler.Errors);
        }
    }
}
