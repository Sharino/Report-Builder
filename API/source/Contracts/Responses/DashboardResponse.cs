using System.Collections.Generic;
using Contracts.DTO;

namespace Contracts.Responses
{
    public class DashboardResponse
    {
        public DashboardResponse(List<DashboardDto> dashboardDtos)
        {
            Errors = null;
            DashboardDtos = dashboardDtos;
        }

        public DashboardResponse(DashboardDto dashboardDto)
        {
            Errors = null;
            DashboardDtos = new List<DashboardDto> {dashboardDto};
        }

        public DashboardResponse(List<ErrorDto> errors)
        {
            Errors = errors;
            DashboardDtos = null;
        }

        public DashboardResponse(ErrorDto error)
        {
            Errors = new List<ErrorDto> {error};
            DashboardDtos = null;
        }


        public List<ErrorDto> Errors { get; set; }
        public List<DashboardDto> DashboardDtos { get; set; }
    }
}
