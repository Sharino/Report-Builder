using System;
using BussinessLogic.Handlers.Base;
using BussinessLogic.Mappings;
using Contracts.DTO;
using Contracts.Responses;
using DataLayer.Repositories;

namespace BussinessLogic.Handlers.DashboardComponentHandlers
{
    public class DashboardComponentDeleteHandler : BaseHandler<int, DashboardComponentResponse>
    {
        private readonly IDashboardComponentRepository _dashboardComponentRepository;
        private readonly IDashboardComponentRepository _repository;

        public DashboardComponentDeleteHandler(IDashboardComponentRepository dashboardComponentRepository = null, IDashboardComponentRepository repository = null)
        {
            _dashboardComponentRepository = dashboardComponentRepository ?? new DashboardComponentRepository();
            _repository = repository ?? new DashboardComponentRepository();
        }

        public override DashboardComponentResponse HandleCore(int request)
        {
            var mapping = new Mapping();
            var dashboardComponent = _repository.Get(request);
            var dashboardComponentDto = mapping.DashboardComponentToDto(dashboardComponent);
            _repository.Remove(request);
            _dashboardComponentRepository.UpdateDashboardAfterRemoval(dashboardComponent);
            return new DashboardComponentResponse(dashboardComponentDto);
        }

        public override bool Validate(int request)
        {
            if (_repository.Exists(request))
                return true;
            Errors.Add(new ErrorDto("404", "Dashboard Component with such ID does not exist"));
            return false;
        }
    }
}
