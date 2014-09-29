using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using BussinessLogic.Handlers;
using Logging;
using Models.Models;

namespace ApiHost.Apis
{
    [EnableCors(origins: "*", headers: "*", methods: "*")] 
    public class ReportComponentController : ApiController
    {
        private readonly ReportComponentHandler ReportHandler;
        private Log Log;

        public ReportComponentController()
        {
            ReportHandler = new ReportComponentHandler();
            Log = new Log("ReportComponentController");
        }

        [HttpGet]
        public HttpResponseMessage GetAll()
        {//todo 
            IEnumerable<ReportComponent> reportComponents = new List<ReportComponent>();
            reportComponents = ReportHandler.GetAll().OrderBy(x => x.Id);
            Log.Info("All Report Components were requested");
            return Request.CreateResponse(HttpStatusCode.OK, reportComponents);
        }

        [HttpGet]
        public HttpResponseMessage Get(int id)
        {
            var reportComponent = ReportHandler.Get(id);
            if (reportComponent != null)
            {
                Log.Info("Requested a Report Component");
                return Request.CreateResponse(HttpStatusCode.OK, reportComponent);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

        [HttpPut]
        public HttpResponseMessage AddPut(ReportComponent report)
        {

            report.Id = ReportHandler.Add(report);

            if (report.Id != -1)
            {
                Log.Info("New report added");
                return Request.CreateResponse(HttpStatusCode.OK, report);

            }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

        [HttpPost]
        public HttpResponseMessage AddPost(ReportComponent report)
        {

            report.Id = ReportHandler.Add(report);

            if (report.Id != -1)
            {
                Log.Info("New report added");
                return Request.CreateResponse(HttpStatusCode.OK, report);

            }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

        [HttpDelete]
        public HttpResponseMessage Remove(int id)
        {
            ReportHandler.Remove(id);
            Log.Info("Entry with id " + id.ToString() + " removed");
            return Request.CreateResponse(HttpStatusCode.OK, -1);
        }
    }
}








/*
           
*/