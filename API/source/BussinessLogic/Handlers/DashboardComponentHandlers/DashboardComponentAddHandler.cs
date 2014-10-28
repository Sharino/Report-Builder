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
        private readonly IDashboardComponentRepository _repository;

        public DashboardComponentAddHandler(IDashboardComponentRepository repository = null)
        {
            _repository = repository ?? new DashboardComponentRepository();
        }

        public DashboardComponentResponse HandleCore(int dashboardId, int reportComponentId)
        {
            var mapping = new Mapping();
            var reportComponentRepository = new ReportComponentRepository();
            var reportComponent = reportComponentRepository.Get(reportComponentId);

            var dashboardComponent = mapping.ReportComponentToDashboardComponent(reportComponent);
            dashboardComponent.DashboardId = dashboardId;
            dashboardComponent.CreationDate = DateTime.UtcNow.ToString();
            _repository.Add(dashboardComponent);

            var componentDto = mapping.DashboardComponentToDto(dashboardComponent);
            return new DashboardComponentResponse(componentDto);
        }

        public bool Validate(int dashboardId, int reportComponentId)
        {
            Errors = new List<ErrorDto>();
            if (_repository.ReportComponentExists(reportComponentId))
            {
                if (_repository.DashboardExists(dashboardId))
                {
                    return true;
                }
                Errors.Add(new ErrorDto("404", "A Dashboard with such ID does not exist", DateTime.UtcNow));
            }
            else Errors.Add(new ErrorDto("404", "A Report Component with such ID does not exist", DateTime.UtcNow));
            return false;
        }
    }
}
