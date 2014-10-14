using BussinessLogic.Handlers.Base;
using BussinessLogic.Mappings;
using Contracts.DTO;
using Contracts.Responses;
using DataLayer.Repositories;
using Models.Models;

namespace BussinessLogic.Handlers.DashboardHandlers
{
    public class DashboardAddHandler : BaseHandler<DashboardDto, DashboardResponse>
    {
        private readonly IDashboardRepository _repository;

        public DashboardAddHandler(IDashboardRepository repository = null)
        {
            _repository = repository ?? new DashboardRepository();
        }

        public override DashboardResponse HandleCore(DashboardDto request)
        {
            var mapping = new Mapping();
            Dashboard dashboard = mapping.DtoToDashboard(request);
            int id = _repository.Add(dashboard);
            request.Id = id;
            return new DashboardResponse(request);
        }

        public override bool Validate(DashboardDto request)
        {
            return true;
        }
    }
}
