using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using Models.Models;

namespace Controllers.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DimensionController : ApiController
    {
        [HttpGet]
        public HttpResponseMessage Get(int id)
        {
            var garbage = new GarbageDimension
            {
                Description = "Description",
                DimensionId = 1,
                DisplayName = "Garbage Name",
                Mnemonic = "Garbage",
                Group = new MetricGroup
                {
                    GroupId = 1,
                    GroupName = "Garbage Group"
                }
            };
            return Request.CreateResponse(HttpStatusCode.OK, garbage);
        }

        [HttpGet]
        public HttpResponseMessage GetAll()
        {
            var garbageList = new List<GarbageDimension>
            {
                new GarbageDimension
                {
                    Description = "Garbage Item 1",
                    DimensionId = 1,
                    DisplayName = "Garbage Name 1",
                    Mnemonic = "Garbage 1",
                    Group = new MetricGroup
                    {
                        GroupId = 1,
                        GroupName = "Garbage Group 1"
                    }
                },
                new GarbageDimension
                {
                    Description = "Garbage Item 2",
                    DimensionId = 2,
                    DisplayName = "Garbage Name 2",
                    Mnemonic = "Garbage 2",
                    Group = new MetricGroup
                    {
                        GroupId = 1,
                        GroupName = "Garbage Group 1"
                    }
                },
                new GarbageDimension
                {
                    Description = "Garbage Item 3",
                    DimensionId = 3,
                    DisplayName = "Garbage Name 3",
                    Mnemonic = "Garbage 3",
                    Group = new MetricGroup
                    {
                        GroupId = 2,
                        GroupName = "Garbage Group 2"
                    }
                }
            };

            return Request.CreateResponse(HttpStatusCode.OK, garbageList);
        }
    }

    public class GarbageDimension
    {
        public int DimensionId { get; set; }
        public MetricGroup Group { get; set; }
        public string DisplayName { get; set; }
        public string Description { get; set; }
        public string Mnemonic { get; set; }
    }
}
