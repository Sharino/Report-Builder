using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using BussinessLogic.Handlers.DimensionHandlers;

namespace Controllers.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DimensionController : ApiController
    {
        [HttpGet]
		public HttpResponseMessage GetAll()
		{
			var handler = new DimensionGetAllHandler();
			var response = handler.Handle(0);

			if (handler.Errors == null || handler.Errors.Count < 1)
			{
				return Request.CreateResponse(HttpStatusCode.OK, response.DimensionDtos);
			}
			return Request.CreateResponse(HttpStatusCode.BadRequest, handler.Errors);
		}

		[HttpGet]
		public HttpResponseMessage Get(int id)
		{
			var handler = new DimensionGetHandler();
			var response = handler.Handle(id);
			if (handler.Errors == null || handler.Errors.Count < 1)
			{
				return Request.CreateResponse(HttpStatusCode.OK, response.DimensionDtos[0]);
			}
			return Request.CreateResponse(HttpStatusCode.BadRequest, handler.Errors);
		}
	}
}
