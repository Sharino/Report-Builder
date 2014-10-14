using System.Net;
using System.Net.Http;
using System.Web.Http;
using BussinessLogic.Handlers.DashboardHandlers;
using Contracts.DTO;

namespace Controllers.Controllers
{
    public class DashboardController : ApiController
    {
        [HttpGet]
        public HttpResponseMessage GetAll()
        {
            var handler = new DashboardGetAllHandler();
            var response = handler.Handle(0);
            if (response != null)
            {
                if (response.DashboardDtos != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, response.DashboardDtos);
                }
                return Request.CreateResponse(HttpStatusCode.NoContent, response.Errors);
            }
            return Request.CreateResponse(HttpStatusCode.NoContent);
        }

        [HttpGet]
        public HttpResponseMessage Get(int id)
        {
            var handler = new DashboardGetHandler();
            var response = handler.Handle(id);
            if (response != null)
            {
                if (response.DashboardDtos != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, response.DashboardDtos[0]);
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, response.Errors);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

        [HttpPost]
        public HttpResponseMessage Add(DashboardDto dashboardDto)
        {
            var handler = new DashboardAddHandler();
            var response = handler.Handle(dashboardDto);
            if (response != null)
            {
                if (response.DashboardDtos != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, response.DashboardDtos[0]);
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, response.Errors);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

        [HttpPut]
        public HttpResponseMessage Update(DashboardDto reportDto)
        {
            var handler = new DashboardUpdateHandler();
            var response = handler.Handle(reportDto);
            if (response != null)
            {
                if (response.DashboardDtos != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, response.DashboardDtos[0]);
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, response.Errors);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

        [HttpDelete]
        public HttpResponseMessage Delete(int id)
        {
            var handler = new DashboardDeleteHandler();
            var response = handler.Handle(id);
            if (response != null)
            {
                if (response.DashboardDtos != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, response.DashboardDtos[0]);
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, response.Errors);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }
    }
}
