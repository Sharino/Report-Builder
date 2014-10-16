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
        private readonly IDashboardComponentRepository _repository;

        public DashboardComponentDeleteHandler(IDashboardComponentRepository repository = null)
        {
            _repository = repository ?? new DashboardComponentRepository();
        }

        public override DashboardComponentResponse HandleCore(int request)
        {
            var mapping = new Mapping();
            var toDelete = mapping.DashboardComponentToDto(_repository.Get(request));
            _repository.Remove(request);
            return new DashboardComponentResponse(toDelete);
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
