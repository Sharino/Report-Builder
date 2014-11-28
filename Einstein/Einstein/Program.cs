using System;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.ServiceProcess;
using Controllers;
using log4net;
using log4net.Config;
using Microsoft.Owin.Hosting;

namespace Einstein
{
     

    class Program
    {

        private static readonly ILog _log = LogManager.GetLogger("Program class");
 

        #region Nested classes to support running as service
        public const string ServiceName = "Adform.ReportBuilder.IAPI.Host";
        private static IDisposable _webHost;
        public class Service : ServiceBase
        {
            public Service()
            {
                ServiceName = ServiceName;
            }
            protected override void OnStart(string[] args)
            {
                Start();
            }
            protected override void OnStop()
            {
                Program.Stop();
            }
        }
        
        #endregion
        static void Main(string[] args)
        {
            XmlConfigurator.Configure();
            //BasicConfigurator.Configure();
            _log.Debug("Start main");

            try
            {
                if (args.Length > 0)
                {
                    _log.Debug("Args more then 0");
                    if (args[0].Equals("-install"))
                    {
                        string loc = Assembly.GetExecutingAssembly().GetName().CodeBase;
                        string location = loc.Remove(0, 8); 
                        var process = new Process();
                        var info = new ProcessStartInfo
                        {
                            Verb = "runas",
                            FileName = "cmd.exe",
                            RedirectStandardInput = true,
                            UseShellExecute = false
                        };
                        process.StartInfo = info;
                        process.Start();
                        using (StreamWriter sw = process.StandardInput)
                        {
                            if (sw.BaseStream.CanWrite)
                            {
                                sw.WriteLine("sc stop \"Einstein\"");
                                sw.WriteLine("sc delete \"Einstein\"");
                                sw.WriteLine("sc create \"Einstein\" binpath= \"" + location + "\"");
                                sw.WriteLine("sc start \"Einstein\"");
                            }
                        }
                    }
                }
                //Launches as console application when Environment.UserInteractive if true. Otherwise it launches as a service.
                if (!Environment.UserInteractive)
                {
                    _log.Debug("Env is not user interactive");
                    using (var service = new Service())
                    {
                        _log.Debug("Start service run");
                        ServiceBase.Run(service);
                        _log.Debug("Stop service run");
                    }
                }
                else
                {

                    Console.WriteLine(@"Running");
                    _log.Debug("Start service run user interactive");
                    Start();
                    Console.ReadKey();
                    _log.Debug("Stopping service run user interactive");

                    Stop();
                    _log.Debug("Stop service run user interactive");

                }
            }
            catch (Exception exception)
            {
                _log.Error("Error in main", exception);
                Stop();
            }
        }



        //TODO: http://stackoverflow.com/questions/2456819/how-can-i-set-up-net-unhandledexception-handling-in-a-windows-service
        private static void Start()
        {
            _log.Debug("Starting start" );
            var ip = ConfigurationManager.AppSettings["ip"];
            _webHost = WebApp.Start<Startup>(ip);
        }
        private static void Stop()
        {
            _log.Debug("Stoping web host");
            _webHost.Dispose();
        }

    }


}
