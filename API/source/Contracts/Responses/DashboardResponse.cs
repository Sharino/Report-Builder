using System.Collections.Generic;
using Contracts.DTO;

namespace Contracts.Responses
{
    public class DashboardResponse
    {
        public DashboardResponse(List<DashboardDto> dashboardDtos)
        {
            DashboardDtos = dashboardDtos;
        }

        public DashboardResponse(DashboardDto dashboardDto)
        {
            DashboardDtos = new List<DashboardDto> {dashboardDto};
        }

        public List<DashboardDto> DashboardDtos { get; set; }
    }
}
