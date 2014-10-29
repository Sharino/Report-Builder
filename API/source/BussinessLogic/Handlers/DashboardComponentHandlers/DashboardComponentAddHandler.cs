using System;
using System.Collections.Generic;
using BussinessLogic.Mappings;
using Contracts.DTO;
using Contracts.Responses;
using DataLayer.Repositories;

namespace BussinessLogic.Handlers.DashboardComponentHandlers
{
    public class DashboardComponentAddHandler
    {
        public List<ErrorDto> Errors { get; set; } 
        private readonly IDashboardComponentRepository _dashboardComponentRepository;
        private readonly IReportComponentRepository _reportComponentRepository;

        public DashboardComponentAddHandler(IDashboardComponentRepository dashboardComponentRepository = null, IReportComponentRepository reportComponentRepository = null)
        {
            _dashboardComponentRepository = dashboardComponentRepository ?? new DashboardComponentRepository();
            _reportComponentRepository = reportComponentRepository ?? new ReportComponentRepository();
        }

        public DashboardComponentResponse HandleCore(int dashboardId, int reportComponentId)
        {
            var mapping = new Mapping();
            var reportComponent = _reportComponentRepository.Get(reportComponentId);

            var dashboardComponent = mapping.ReportComponentToDashboardComponent(reportComponent);
            dashboardComponent.DashboardId = dashboardId;
            dashboardComponent.CreationDate = DateTime.UtcNow.ToString("yyyy-MM-dd hh:mm:ss");
            dashboardComponent.Id = _dashboardComponentRepository.Add(dashboardComponent);
            _dashboardComponentRepository.UpdateDashboard(dashboardComponent);
            var componentDto = mapping.DashboardComponentToDto(dashboardComponent);
            return new DashboardComponentResponse(componentDto);
        }

        public bool Validate(int dashboardId, int reportComponentId)
        {
            Errors = new List<ErrorDto>();
            if (!_dashboardComponentRepository.ReportComponentExists(reportComponentId))
            {
                Errors.Add(new ErrorDto("404", "A Report Component with such ID does not exist"));
            }
            if (!_dashboardComponentRepository.DashboardExists(dashboardId))
            {
                Errors.Add(new ErrorDto("404", "A Dashboard with such ID does not exist"));
            }
            
            if (Errors.Count == 0)
                return true;
            return false;
        }
    }
}
