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
				name: "Dashboard",
				routeTemplate: "api/{controller}/{id}",
				defaults: new { controller = "Dashboard", id = RouteParameter.Optional },
				constraints: new { controller = @"(\W|^)Dashboard(\W|$)" }
			);

			configuration.Routes.MapHttpRoute(
				name: "DashboardComponent",
				routeTemplate: "api/{controller}/{id}",
				defaults: new { controller = "DashboardComponent", id = RouteParameter.Optional },
				constraints: new { controller = @"(\W|^)DashboardComponent(\W|$)" }
			);

			configuration.Routes.MapHttpRoute(
				name: "Dimension",
				routeTemplate: "api/{controller}/{id}",
				defaults: new { controller = "Dimension", id = RouteParameter.Optional },
				constraints: new { controller = @"(\W|^)Dimension(\W|$)" }
			);

            configuration.Routes.MapHttpRoute(
                name: "Export",
                routeTemplate: "api/{controller}/{action}",
				defaults: new { controller = "Export" },
				constraints: new { controller = @"(\W|^)Export(\W|$)" }
			);

			configuration.Routes.MapHttpRoute(
				name: "Log",
				routeTemplate: "api/{controller}/{id}",
				defaults: new { controller = "Log", id = RouteParameter.Optional },
				constraints: new { controller = @"(\W|^)Log(\W|$)" }
			);

			configuration.Routes.MapHttpRoute(
				name: "Metric",
				routeTemplate: "api/{controller}/{id}",
				defaults: new { controller = "Metric", id = RouteParameter.Optional },
				constraints: new { controller = @"(\W|^)Metric(\W|$)" }
			);

			configuration.Routes.MapHttpRoute(
				name: "ReportComponent",
				routeTemplate: "api/{controller}/{id}",
				defaults: new { controller = "ReportComponent", id = RouteParameter.Optional },
				constraints: new { controller = @"(\W|^)ReportComponent(\W|$)" }
			);

            configuration.Routes.MapHttpRoute(
                name: "MetricDimensionMap",
                routeTemplate: "api/{controller}",
                defaults: new { controller = "MetricDimensionMap"},
                constraints: new { controller = @"(\W|^)MetricDimensionMap(\W|$)" }
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
