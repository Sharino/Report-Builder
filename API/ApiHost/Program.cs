using Microsoft.Owin.Hosting;
using System;
using System.ServiceProcess;

namespace ApiHost
{
    public static class Program
    {
        #region Nested classes to support running as service

        public const string ServiceName = "Adform.ReportBuilder.IAPI.Host";

        public class Service : ServiceBase
        {
            public Service()
            {
                ServiceName = ServiceName;
            }

            protected override void OnStart(string[] args)
            {
                Program.Start(args);
            }

            protected override void OnStop()
            {
                Program.Stop();
            }
        }

        private static IDisposable _webHost;

        #endregion

        private static void Main(string[] args)
        {
            //Launches as console application when Environment.UserInteractive if true. Otherwise it launches as a service.
            if (!Environment.UserInteractive)
            {
                using (var service = new Service())
                    ServiceBase.Run(service);
            }
            else
            {
                Console.WriteLine("Running as console application");
                Console.WriteLine("Press Enter to Quit . . .");
                Start(args);
                Console.ReadKey();
                Stop();
            }

        }

        //TODO: http://stackoverflow.com/questions/2456819/how-can-i-set-up-net-unhandledexception-handling-in-a-windows-service
        private static void Start(string[] args) // "http://172.22.3.236:33894/";
        {
            //TODO move to config
            const string baseUrl = "http://172.22.3.236:33894/";

            _webHost = WebApp.Start<Startup>(baseUrl);
        }

        private static void Stop()
        {
            _webHost.Dispose();
        }
    }
}
