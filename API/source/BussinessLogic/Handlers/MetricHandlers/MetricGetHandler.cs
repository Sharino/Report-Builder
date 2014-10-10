using System;
using BussinessLogic.Handlers.Base;
using Contracts.DTO;
using Contracts.Responses;
using DataLayer.Repositories;
using BussinessLogic.Mappings;

namespace BussinessLogic.Handlers.MetricHandlers
{
    public class MetricGetHandler : BaseHandler<int, MetricResponse>
    {
        private readonly IMetricsRepository _repository;
        public MetricGetHandler(IMetricsRepository repository = null)
        {
            _repository = repository ?? new MetricRepository();
        }

        public override MetricResponse HandleCore(int request)
        {
            var mapper = new Mapping();
            var metric = _repository.Get(request);
            return new MetricResponse(mapper.MetricToDto(metric));
        }

        public override bool Validate(int request)
        {
            if (_repository.Exists(request))
                return true;
            Response = new MetricResponse(new ErrorDto("EN", "A metric with such id does not exist", DateTime.Now));
            return false;
        }
    }
}
