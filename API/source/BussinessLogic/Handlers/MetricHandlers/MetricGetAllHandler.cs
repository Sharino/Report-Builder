using System.Linq;
using BussinessLogic.Handlers.Base;
using BussinessLogic.Mappings;
using Contracts.Responses;
using DataLayer.Repositories;

namespace BussinessLogic.Handlers.MetricHandlers
{
    public class MetricGetAllHandler : BaseHandler<int, MetricResponse>
    {
        private readonly IMetricsRepository _repository;

        public MetricGetAllHandler(IMetricsRepository repository = null)
        {
            _repository = repository ?? new MetricRepository();
        }

        public override MetricResponse HandleCore(int request)
        {
            var mapper = new Mapping();
            var metrics = _repository.GetAll().OrderBy(x => x.MetricId).ToList();
            var dtos = mapper.MetricToDto(metrics);
            return new MetricResponse(dtos.ToList());
        }

        public override bool Validate(int request)
        {
            return true;
        }
    }
}
