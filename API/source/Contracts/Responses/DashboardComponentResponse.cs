
using System.Collections.Generic;
using Contracts.DTO;

namespace Contracts.Responses
{
    public class DashboardComponentResponse
    {
        public DashboardComponentResponse(List<DashboardComponentDto> componentDtos)
        {
            ComponentDtos = componentDtos;
        }

        public DashboardComponentResponse(DashboardComponentDto componentDto)
        {
            ComponentDtos = new List<DashboardComponentDto> { componentDto };
        }

        public List<DashboardComponentDto> ComponentDtos { get; set; }
    }
}
