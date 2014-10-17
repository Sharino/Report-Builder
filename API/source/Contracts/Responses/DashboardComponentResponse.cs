
using System.Collections.Generic;
using Contracts.DTO;

namespace Contracts.Responses
{
    public class DashboardComponentResponse
    {
        public DashboardComponentResponse(List<DashboardComponentDto> componentDtos)
        {
            ComponetDtos = componentDtos;
        }

        public DashboardComponentResponse(DashboardComponentDto componentDto)
        {
            ComponetDtos = new List<DashboardComponentDto> { componentDto };
        }

        public List<DashboardComponentDto> ComponetDtos { get; set; }
    }
}
