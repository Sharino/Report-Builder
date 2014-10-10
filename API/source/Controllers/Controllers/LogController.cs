using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Logging;

namespace Controllers.Controllers
{
    /// <summary>
    /// Log.Item{ Type: int
    //  1. Debug
    //  2. Info
    //  3. Warning
    //  4. Error
    //  5. Fatal
    //  Message: string
    //}
    /// </summary>
    public class LogContent
    {
        public int LogType { get; set; }
        public string Message { get; set; }
    }

    public class LogController : ApiController
    {
        public HttpResponseMessage Log(LogContent content)
        {
            Log log = new Log("LogController");
            try
            {
                switch (content.LogType)
                {
                    case 1:
                        log.Debug(content.Message);
                        break;
                    case 2:
                        log.Info(content.Message);
                        break;
                    case 3:
                        log.Warn(content.Message);
                        break;
                    case 4:
                        log.Error(content.Message);
                        break;
                    case 5:
                        log.Fatal(content.Message);
                        break;
                    default:
                        log.Debug(content.Message);
                        break;
                }
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception exception)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, exception);
            }
        }
    }
}
