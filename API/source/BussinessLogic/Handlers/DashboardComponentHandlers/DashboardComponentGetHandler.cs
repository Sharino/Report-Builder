using System;
using BussinessLogic.Handlers.Base;
using BussinessLogic.Mappings;
using Contracts.DTO;
using Contracts.Responses;
using DataLayer.Repositories;

namespace BussinessLogic.Handlers.DashboardComponentHandlers
{
    public class DashboardComponentGetHandler : BaseHandler<int, DashboardComponentResponse>
    {
        private readonly IDashboardComponentRepository _repository;

        public DashboardComponentGetHandler(IDashboardComponentRepository repository = null)
        {
            _repository = repository ?? new DashboardComponentRepository();
        }

        public override DashboardComponentResponse HandleCore(int request)
        {
            var mapping = new Mapping();
            var component = _repository.Get(request);
            var componentDto = mapping.DashboardComponentToDto(component);
            return new DashboardComponentResponse(componentDto);
        }

        public override bool Validate(int request)
        {
            if (_repository.Exists(request))
                return true;
            Errors.Add(new ErrorDto("404", "Dashboard Component with such ID does not exist", DateTime.UtcNow));
            return false;
        }
    }
}
