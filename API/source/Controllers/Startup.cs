using System.Net.Http.Headers;
using System.Web.Http;
using Owin;

namespace Controllers
{
    public class Startup
    {
        //  Hack from http://stackoverflow.com/a/17227764/19020 to load controllers in another assembly. 

        public void Configuration(IAppBuilder appBuilder)
        {
            // Setup WebAPI configuration  
            var configuration = new HttpConfiguration();

            // http://localhost:5000/swagger
            // https://github.com/domaindrivendev/Swashbuckle
            Swashbuckle.Bootstrapper.Init(configuration);

            //http://www.asp.net/web-api/overview/security/enabling-cross-origin-requests-in-web-api
            configuration.EnableCors();


            configuration.Routes.MapHttpRoute(
                name: "API",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional },
			constraints: new { controller = @"^(?:(?!export).)*$" }

			);

            configuration.Routes.MapHttpRoute(
                name: "Export",
                routeTemplate: "api/{controller}/{action}",
				defaults: new { controller = "Export" }
			);


            configuration.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));

            // Register the WebAPI to the pipeline  
            appBuilder.UseWebApi(configuration);

            // let's keep the old stuff too....   
            // Those who are familier with HttpContext, owinContext is just a brother from another mother.  
            appBuilder.Run(owinContext =>
            {
                owinContext.Response.ContentType = "text/plain";
                // here comes the performance, everythign in the Katana is Async. Living in the current century.  
                // Let's print our obvious message: :)  
                return owinContext.Response.WriteAsync("Api is available at:  /swagger");
            });
        }
    }
}
