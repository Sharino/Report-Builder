using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using BussinessLogic.Handlers;
using Logging;
using Models.DTO;

namespace ApiHost.Apis
{
    [EnableCors(origins: "*", headers: "*", methods: "*")] 
    public class ReportComponentController : ApiController
    {
        private Log Log;
        private BaseHandler<ReportComponentDTO> ReportComponentHandler;

        public ReportComponentController()
        {
            ReportComponentHandler = new ReportComponentHandler();
            Log = new Log("ReportComponentController");
        }

        [HttpGet]
        public HttpResponseMessage GetAll()
        {
            var response = ReportComponentHandler.GetAll();
            if (response.Errors == null)
            {
                IEnumerable<ReportComponentDTO> reportComponentDtos = response.ReportComponentDtos;
                return Request.CreateResponse(HttpStatusCode.OK, reportComponentDtos);
            }
            return Request.CreateResponse(HttpStatusCode.NoContent, response.Errors);
        }

        [HttpGet]
        public HttpResponseMessage Get(int id)
        {
            var response = ReportComponentHandler.Get(id);
            if (response.Errors == null)
            {
                return Request.CreateResponse(HttpStatusCode.OK, response.ReportComponentDtos[0]);
            }
            return Request.CreateResponse(HttpStatusCode.NotFound, response.Errors);
        }

        [HttpPut]
        public HttpResponseMessage AddPut(ReportComponentDTO reportDTO)
        {
            var response = ReportComponentHandler.Add(reportDTO);
            if (response.Errors == null)
            {
                return Request.CreateResponse(HttpStatusCode.OK, response.ReportComponentDtos[0]);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, response.Errors);
        }

        [HttpPost]
        public HttpResponseMessage AddPost(ReportComponentDTO reportDTO)
        {
            var response = ReportComponentHandler.Add(reportDTO);
            if (response.Errors == null)
            {
                return Request.CreateResponse(HttpStatusCode.OK, response.ReportComponentDtos[0]);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, response.Errors);
        }

        [HttpDelete]
        public HttpResponseMessage Remove(int id)
        {
            var response = ReportComponentHandler.Remove(id);
            if (response.Errors == null)
            {
                return Request.CreateResponse(HttpStatusCode.OK, response.ReportComponentDtos[0]);
            }
            return Request.CreateResponse(HttpStatusCode.NotFound, response.Errors);
        }
    }
}
