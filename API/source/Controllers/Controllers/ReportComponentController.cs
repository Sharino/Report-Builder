using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using BussinessLogic.Handlers;
using BussinessLogic.Handlers.Base;
using Contracts.Responses;
using Logging;
using Models.DTO;


namespace Controllers.Apis
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ReportComponentController : ApiController
    {
        private Log Log;

        public ReportComponentController()
        {
            Log = new Log("ReportComponentController");
        }

        [HttpGet]
        public HttpResponseMessage GetAll()
        {            //TODO
            BaseHandler<int, ReportComponentResponse> Handler = new GetAllHandler();
            var response = Handler.Handle(0);
            if (response != null)
            {
                if (response.ReportComponentDtos != null)
                {
                    IEnumerable<ReportComponentDTO> reportComponentDtos = response.ReportComponentDtos;
                    return Request.CreateResponse(HttpStatusCode.OK, reportComponentDtos);
                }
                return Request.CreateResponse(HttpStatusCode.NoContent, response.Errors);
            }
            return Request.CreateResponse(HttpStatusCode.NoContent);
        }

        [HttpGet]
        public HttpResponseMessage Get(int id)
        {
            BaseHandler<int, ReportComponentResponse> Handler = new GetHandler();
            var response = Handler.Handle(id);
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
        public HttpResponseMessage Update(ReportComponentDTO reportDto)
        {
            var Handler = new UpdateHandler();
            var response = Handler.Handle(reportDto);
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
        public HttpResponseMessage Add(ReportComponentDTO reportDto)
        {
            BaseHandler<ReportComponentDTO, ReportComponentResponse> Handler = new AddHandler();
            var response = Handler.Handle(reportDto);
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
            BaseHandler<int, ReportComponentResponse> Handler = new DeleteHandler();
            var response = Handler.Handle(id);
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
