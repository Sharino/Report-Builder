using BussinessLogic.Handlers.Base;
using BussinessLogic.Mappings;
using Contracts.Responses;
using DataLayer.Repositories;

namespace BussinessLogic.Handlers.DashboardHandlers
{
    public class DashboardGetHandler : BaseHandler<int, DashboardResponse>
    {
        private readonly IDashboardRepository _repository;

        public DashboardGetHandler(IDashboardRepository repository = null)
        {
            _repository = repository ?? new DashboardRepository();
        }

        public override DashboardResponse HandleCore(int request)
        {
            var mapping = new Mapping();
            var dashboard = _repository.Get(request);
            var dashboardDto = mapping.DashboardToDto(dashboard);
            return new DashboardResponse(dashboardDto);
        }

        public override bool Validate(int request)
        {
            return true;
        }
    }
}
