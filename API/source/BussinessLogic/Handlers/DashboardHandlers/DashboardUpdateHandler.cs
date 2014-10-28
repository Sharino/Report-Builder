using BussinessLogic.Handlers.Base;
using BussinessLogic.Mappings;
using Contracts.DTO;
using Contracts.Responses;
using DataLayer.Repositories;

namespace BussinessLogic.Handlers.DashboardHandlers
{
    public class DashboardUpdateHandler : BaseHandler<DashboardDto, DashboardResponse>
    {
        private readonly IDashboardRepository _repository;

        public DashboardUpdateHandler(IDashboardRepository repository = null)
        {
            _repository = repository ?? new DashboardRepository();
        }

        public override DashboardResponse HandleCore(DashboardDto request)
        {
            var mapping = new Mapping();
            var report = mapping.DtoToDashboard(request);
            int id = _repository.Update(report);
            request.Id = id;
            return new DashboardResponse(request);
        }

        public override bool Validate(DashboardDto request)
        {
            return true;
        }
    }
}
