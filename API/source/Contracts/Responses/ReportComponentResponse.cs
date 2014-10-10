using System.Collections.Generic;
using Contracts.DTO;

namespace Contracts.Responses
{
    /// <summary>
    /// This response should contain either ErrorDTO (code, msg, timestamp) or ReportComponent(s) if the operation is successful
    /// </summary>
    public class ReportComponentResponse
    {
        public ReportComponentResponse(List<ReportComponentDto> reportComponentDtos)
        {
            Errors = null;
            ReportComponentDtos = reportComponentDtos;
        }

        public ReportComponentResponse(ReportComponentDto reportComponent)
        {
            Errors = null;
            ReportComponentDtos = new List<ReportComponentDto> {reportComponent};
        }

        public ReportComponentResponse(List<ErrorDto> errors)
        {
            Errors = errors;
            ReportComponentDtos = null;
        }

        public ReportComponentResponse(ErrorDto error)
        {
            Errors = new List<ErrorDto> {error};
            ReportComponentDtos = null;
        }


        public List<ErrorDto> Errors { get; set; }
        public List<ReportComponentDto> ReportComponentDtos { get; set; }
    }
}