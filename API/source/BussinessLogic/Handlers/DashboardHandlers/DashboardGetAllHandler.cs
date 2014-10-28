using System.Linq;
using BussinessLogic.Handlers.Base;
using BussinessLogic.Mappings;
using Contracts.Responses;
using DataLayer.Repositories;

namespace BussinessLogic.Handlers.DashboardHandlers
{
    public class DashboardGetAllHandler : BaseHandler<int, DashboardResponse>
    {
        private readonly IDashboardRepository _repository;

        public DashboardGetAllHandler(IDashboardRepository repository = null)
        {
            _repository = repository ?? new DashboardRepository();
        }

        public override DashboardResponse HandleCore(int request)
        {
            var mapping = new Mapping();
            var reports = _repository.GetAll().OrderBy(x => x.Id).ToList();
            var reportDtos = mapping.ReportToDto(reports);
            return new DashboardResponse(reportDtos);
        }

        public override bool Validate(int request)
        {
            return true;
        }
    }
}
