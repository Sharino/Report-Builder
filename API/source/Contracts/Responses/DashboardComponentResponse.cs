
using System.Collections.Generic;
using Contracts.DTO;

namespace Contracts.Responses
{
    public class DashboardComponentResponse
    {
        public DashboardComponentResponse(List<DashboardComponentDto> componentDtos)
        {
            Errors = null;
            ComponetDtos = componentDtos;
        }

        public DashboardComponentResponse(DashboardComponentDto componentDto)
        {
            Errors = null;
            ComponetDtos = new List<DashboardComponentDto> { componentDto };
        }

        public DashboardComponentResponse(List<ErrorDto> errors)
        {
            Errors = errors;
            ComponetDtos = null;
        }

        public DashboardComponentResponse(ErrorDto error)
        {
            Errors = new List<ErrorDto> {error};
            ComponetDtos = null;
        }


        public List<ErrorDto> Errors { get; set; }
        public List<DashboardComponentDto> ComponetDtos { get; set; }
    }
}
