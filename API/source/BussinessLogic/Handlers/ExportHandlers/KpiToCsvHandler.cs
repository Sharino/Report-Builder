using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Text;
using Contracts.DTO;
using Models.Models;

namespace BussinessLogic.Handlers.ExportHandlers
{
    public class KpiToCsvHandler
    {
        public List<ErrorDto> Errors;

        public string HandleCore(ExportRequest request, string separator)
        {
            try
            {
                var generatedDate = new StringBuilder("Generated on " + request.GeneratedDate);
                if (!string.IsNullOrEmpty(request.Language))
                {
                    generatedDate.Append(Environment.NewLine + "Language" + separator + request.Language);
                }
                var dates = new StringBuilder(request.StartDate + separator + request.EndDate);
                var header = new StringBuilder();
                var content = new StringBuilder();

                foreach (var val in request.Values)
                {
                    header.Append(val.Key + separator);
                    content.Append(val.Value + separator);
                }
                header.Remove(header.Length - 1, 1);
                content.Remove(content.Length - 1, 1);

                string fileName = request.Title + "-" + Environment.TickCount + ".csv";

                string filePath = ConfigurationManager.AppSettings["exportsFilePath"] + fileName;

                using (var fs = new FileStream(filePath, FileMode.Append, FileAccess.Write))
                using (var sw = new StreamWriter(fs))
                {
                    sw.WriteLine(generatedDate);
                    sw.WriteLine(dates);
                    sw.WriteLine(header);
                    sw.WriteLine(content);
                    sw.Close();
                    fs.Close();
                }
                return fileName;
            }
            catch (Exception exception)
            {
                Errors = new List<ErrorDto> {new ErrorDto("400", "Unable to export")};
            }
            return "";
        }
    }
}
