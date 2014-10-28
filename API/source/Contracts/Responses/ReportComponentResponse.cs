using System.Collections.Generic;
using Contracts.DTO;

namespace Contracts.Responses
{
    public class ReportComponentResponse
    {
        public ReportComponentResponse(List<ReportComponentDto> reportComponentDtos)
        {
            ReportComponentDtos = reportComponentDtos;
        }

        public ReportComponentResponse(ReportComponentDto reportComponent)
        {
            ReportComponentDtos = new List<ReportComponentDto> {reportComponent};
        }

        public List<ReportComponentDto> ReportComponentDtos { get; set; }
    }
}