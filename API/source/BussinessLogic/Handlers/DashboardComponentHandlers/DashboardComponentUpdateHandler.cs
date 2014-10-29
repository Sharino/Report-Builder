using BussinessLogic.Handlers.Base;
using BussinessLogic.Mappings;
using Contracts.DTO;
using Contracts.Responses;
using DataLayer.Repositories;

namespace BussinessLogic.Handlers.DashboardComponentHandlers
{
    public class DashboardComponentUpdateHandler : BaseHandler<DashboardComponentDto, DashboardComponentResponse>
    {
        private readonly IDashboardComponentRepository _repository;

        public DashboardComponentUpdateHandler(IDashboardComponentRepository repository = null)
        {
            _repository = repository ?? new DashboardComponentRepository();
        }

        public override DashboardComponentResponse HandleCore(DashboardComponentDto request)
        {
            var mapping = new Mapping();
            var component = mapping.DtoToDashboardComponent(request);
            int id = _repository.Update(component);
            request.Id = id;
            return new DashboardComponentResponse(request);
        }

        public override bool Validate(DashboardComponentDto request)
        {
            if (_repository.Exists(request.Id))
                return true;
            Errors.Add(new ErrorDto("404", "A Dashboard Component with such ID does not exist."));
            return false;
        }
    }
}
