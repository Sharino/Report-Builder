using System.Collections.Specialized;
using System.Diagnostics;
using System.IO;
using System.Net.Mime;
using System.Web.Configuration;
using Microsoft.Owin.Hosting;
using System;
using System.ServiceProcess;
using System.Configuration;

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
            if (args.Length > 0)
            {
                if (args[0].Equals("-install"))
                {
                    var loc = System.Reflection.Assembly.GetExecutingAssembly().GetName().CodeBase;
                    var location = loc.Remove(0, 8); //file:///c:/...

                    var process = new Process();
                    ProcessStartInfo info = new ProcessStartInfo();
                    info.Verb = "runas";
                    info.FileName = "cmd.exe";
                    info.RedirectStandardInput = true;
                    info.UseShellExecute = false;

                    process.StartInfo = info;
                    process.Start();
                    using (StreamWriter sw = process.StandardInput)
                    {
                        if (sw.BaseStream.CanWrite)
                        {
                            sw.WriteLine("sc stop \"Report Builder\"");
                            sw.WriteLine("sc delete \"Report Builder\"");
                            sw.WriteLine("sc create \"Report Builder\" binpath= \"" + location + "\"");
                            sw.WriteLine("sc start \"Report Builder\"");
                        }
                    }
                }
            }
            
            //Launches as console application when Environment.UserInteractive if true. Otherwise it launches as a service.
            if (!Environment.UserInteractive)
            {
                using (var service = new Service())
                    ServiceBase.Run(service);
            }
            else
            {
                Console.WriteLine("Running");
                Start(args);
                Console.ReadKey();
                Stop();
            }

        }

        //TODO: http://stackoverflow.com/questions/2456819/how-can-i-set-up-net-unhandledexception-handling-in-a-windows-service
        private static void Start(string[] args)
        {
            var ip = ConfigurationManager.AppSettings["ip"];
            _webHost = WebApp.Start<Startup>(ip);
        }

        private static void Stop()
        {
            _webHost.Dispose();
        }
    }
}
