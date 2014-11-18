using BussinessLogic.Handlers.Base;
using BussinessLogic.Mappings;
using Contracts.DTO;
using Contracts.Responses;
using DataLayer.Repositories;

namespace BussinessLogic.Handlers.DashboardHandlers
{
    public class DashboardDeleteHandler : BaseHandler<int, DashboardResponse>
    {
        private readonly IDashboardRepository _repository;
        public DashboardDeleteHandler(IDashboardRepository repository = null)
        {
            _repository = repository ?? new DashboardRepository();
        }

        public override DashboardResponse HandleCore(int request)
        {
            var mapping = new Mapping();
            DashboardDto toDelete = mapping.DashboardToDto(_repository.Get(request));
            var componentRepository = new DashboardComponentRepository();
            foreach (var id in toDelete.ComponentIds)
            {
                componentRepository.Remove(id);
            }
            _repository.Remove(request);
            return new DashboardResponse(toDelete);
        }

        public override bool Validate(int request)
        {
            if (_repository.Exists(request))
                return true;
            return false;
        }
    }
}
