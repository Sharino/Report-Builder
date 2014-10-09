using System.Collections.Generic;
using Contracts.DTO;
using Models.DTO;

namespace Contracts.Responses
{
    /// <summary>
    /// This response should contain either ErrorDTO (code, msg, timestamp) or ReportComponent(s) if the operation is successful
    /// </summary>
    public class ReportComponentResponse
    {
        public ReportComponentResponse(List<ReportComponentDTO> reportComponentDtos)
        {
            Errors = null;
            ReportComponentDtos = reportComponentDtos;
        }

        public ReportComponentResponse(ReportComponentDTO reportComponent)
        {
            Errors = null;
            ReportComponentDtos = new List<ReportComponentDTO> {reportComponent};
        }

        public ReportComponentResponse(List<ErrorDTO> errors)
        {
            Errors = errors;
            ReportComponentDtos = null;
        }

        public ReportComponentResponse(ErrorDTO error)
        {
            Errors = new List<ErrorDTO> {error};
            ReportComponentDtos = null;
        }


        public List<ErrorDTO> Errors { get; set; }
        public List<ReportComponentDTO> ReportComponentDtos { get; set; }
    }
}