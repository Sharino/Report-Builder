using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using BussinessLogic.Handlers.Base;
using BussinessLogic.Handlers.ReportComponentHandlers;
using Contracts.DTO;
using Contracts.Responses;

namespace Controllers.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ReportComponentController : ApiController
    {
        [HttpGet]
        public HttpResponseMessage GetAll()
        {            
            BaseHandler<int, ReportComponentResponse> handler = new GetAllHandler();
            var response = handler.Handle(0);
            if (response != null)
            {
                if (response.ReportComponentDtos != null)
                {
                    IEnumerable<ReportComponentDto> reportComponentDtos = response.ReportComponentDtos;
                    return Request.CreateResponse(HttpStatusCode.OK, reportComponentDtos);
                }
                return Request.CreateResponse(HttpStatusCode.NoContent, response.Errors);
            }
            return Request.CreateResponse(HttpStatusCode.NoContent);
        }

        [HttpGet]
        public HttpResponseMessage Get(int id)
        {
            BaseHandler<int, ReportComponentResponse> handler = new GetHandler();
            var response = handler.Handle(id);
            if (response != null)
            {
                if (response.ReportComponentDtos != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, response.ReportComponentDtos[0]);
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, response.Errors);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

        [HttpPut]
        public HttpResponseMessage Update(ReportComponentDto reportDto)
        {
            var handler = new UpdateHandler();
            var response = handler.Handle(reportDto);
            if (response != null)
            {
                if (response.ReportComponentDtos != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, response.ReportComponentDtos[0]);
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, response.Errors);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

        [HttpPost]
        public HttpResponseMessage Add(ReportComponentDto reportDto)
        {
            BaseHandler<ReportComponentDto, ReportComponentResponse> handler = new AddHandler();
            var response = handler.Handle(reportDto);
            if (response != null)
            {
                if (response.ReportComponentDtos == null)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, response.Errors);
                }
                return Request.CreateResponse(HttpStatusCode.OK, response.ReportComponentDtos[0]);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

        [HttpDelete]
        public HttpResponseMessage Delete(int id)
        {
            BaseHandler<int, ReportComponentResponse> handler = new DeleteHandler();
            var response = handler.Handle(id);
            if (response != null)
            {
                if (response.ReportComponentDtos != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, response.ReportComponentDtos[0]);
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, response.Errors);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }
    }
}
