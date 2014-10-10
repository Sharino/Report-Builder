using System;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.ServiceProcess;
using Controllers;
using Logging;
using Microsoft.Owin.Hosting;

namespace Host
{
    public static class Program
    {
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

        private static void Main(string[] args)
        {
            try
            {
                if (args.Length > 0)
                {
                    if (args[0].Equals("-install"))
                    {
                        string loc = Assembly.GetExecutingAssembly().GetName().CodeBase;
                        string location = loc.Remove(0, 8); //file:///c:/...

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
                    Console.WriteLine(@"Running");
                    Start();
                    Console.ReadKey();
                    Stop();
                }
            }
            catch (Exception exception)
            {
                var log = new Log("Program.cs");
                log.Fatal(exception.ToString());
                Stop();
            }
        }

        //TODO: http://stackoverflow.com/questions/2456819/how-can-i-set-up-net-unhandledexception-handling-in-a-windows-service
        private static void Start()
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