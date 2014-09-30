using System.Collections.Generic;
using Contracts.DTO;
using Models.DTO;

namespace Contracts.Responses
{
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
            ReportComponentDtos = new List<ReportComponentDTO>();
            ReportComponentDtos.Add(reportComponent);
        }

        public ReportComponentResponse(List<ErrorDTO> errors)
        {
            Errors = errors;
            ReportComponentDtos = null;
        }

        public ReportComponentResponse(ErrorDTO error)
        {
            Errors = new List<ErrorDTO>();
            Errors.Add(error);
            ReportComponentDtos = null;
        }

        public List<ErrorDTO> Errors { get; set; }
        public List<ReportComponentDTO> ReportComponentDtos { get; set; }
    }
}