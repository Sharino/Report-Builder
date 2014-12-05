using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Text;
using Contracts.DTO;
using Models.Models;

namespace BussinessLogic.Handlers.ExportHandlers
{
    public class DashboardToCsvHandler
    {
        public List<ErrorDto> Errors;

        public string HandleCore(List<ExportRequest> request, string separator)
        {
            try
            {
                StringBuilder export;
                if (!string.IsNullOrEmpty(request[0].Language))
                {
                    export = new StringBuilder("Language " + separator + request[0].Language + Environment.NewLine);    
                }
                else export = new StringBuilder();

                foreach (var comp in request)
                {
                    var generatedDate = new StringBuilder("Generated on " + comp.GeneratedDate);
                    if (!string.IsNullOrEmpty(comp.Language))
                    {
                        generatedDate.Append(Environment.NewLine + "Language" + separator + comp.Language);
                    }
                    var dates = new StringBuilder(comp.StartDate + separator + comp.EndDate);
                    var header = new StringBuilder();
                    var content = new StringBuilder();

                    foreach (var val in comp.Values)
                    {
                        header.Append(val.Key + separator);
                        content.Append(val.Value + separator);
                    }
                    header.Remove(header.Length - 1, 1);
                    content.Remove(content.Length - 1, 1);

                    export.Append(generatedDate + Environment.NewLine);
                    export.Append(dates + Environment.NewLine);
                    export.Append(header + Environment.NewLine);
                    export.Append(content + Environment.NewLine);
                    export.Append(Environment.NewLine);
                }

                string fileName = "deshberd" + "-" + Environment.TickCount + ".csv";

                string filePath = ConfigurationManager.AppSettings["exportsFilePath"] + fileName;

                using (var fs = new FileStream(filePath, FileMode.Append, FileAccess.Write))
                using (var sw = new StreamWriter(fs))
                {
                    sw.WriteLine(export);
                    sw.Close();
                    fs.Close();
                }
                return fileName;
            }
            catch (Exception exception)
            {
                Errors = new List<ErrorDto> { new ErrorDto("400", "Unable to export") };
            }
            return "";
        }
    }
}
