using System;
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
            if (!_repository.Exists(request.Id))
                Errors.Add(new ErrorDto("404", "A Dashboard with such ID does not exist"));

            var componentRepository = new DashboardComponentRepository();
            if (request.ComponentIds != null)
            {
                if (request.ComponentIds.Count > 0)
                {
                    foreach (var component in request.ComponentIds)
                    {
                        if (componentRepository.Exists(component))
                            continue;
                        Errors.Add(new ErrorDto("404",
                            "A provided Dashboard Component with ID " + component + " does not exist"));
                    }
                }
            }

            if (Errors.Count == 0)
                return true;
            return false;
        }
    }
}
