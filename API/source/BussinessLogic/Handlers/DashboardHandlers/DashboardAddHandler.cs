using System;
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
