using log4net;
using log4net.Config;

namespace Logging
{
    public class Log
    {
        public ILog Logger { get; set; }

        public readonly string Source;

        public Log(string src)
        {
            XmlConfigurator.Configure();
            Logger = LogManager.GetLogger("aa");
            Source = src;
        }

        public void Info(string logMessage)
        {
            Logger.Info(Source + " : " + logMessage);
        }

        public void Warn(string logMessage)
        {
            Logger.Warn(Source + " : " + logMessage);
        }

        public void Error(string logMessage)
        {
            Logger.Error(Source + " : " + logMessage);
        }

        public void Debug(string logMessage)
        {
            Logger.Debug(Source + " : " + logMessage);
        }

        public void Fatal(string logMessage)
        {
            Logger.Fatal(Source + " : " + logMessage);
        }
    }
}
