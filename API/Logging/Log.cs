using System;
using log4net;
using log4net.Config;
using Models.Models;


namespace Logging
{
    public class Log
    {
        private static readonly ILog Logger =
         LogManager.GetLogger("aa");

        static Log()
        {
            XmlConfigurator.Configure();
        }

        public static void Info(string logMessage)
        {
            Logger.Info(logMessage);
        }

        public static void Warn(string logMessage)
        {
            Logger.Warn(logMessage);
        }

        public static void Error(string logMessage)
        {
            Logger.Error(logMessage);
        }

        public static void Debug(string logMessage)
        {
            Logger.Debug(logMessage);
        }

    }
}
