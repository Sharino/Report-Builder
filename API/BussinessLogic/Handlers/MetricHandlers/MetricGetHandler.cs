using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Contracts.DTO;
using Contracts.Responses;
using DataLayer.Base;
using DataLayer.Repositories;
using BussinessLogic.Mappings;

namespace BussinessLogic.Handlers.MetricHandlers
{
    public partial class MetricGetHandler : BaseHandler<int, MetricResponse>
    {
        private readonly IMetricsRepository _repository;
        public MetricGetHandler(IMetricsRepository repository = null)
        {
            if (repository == null)
                _repository = new MetricRepository();
            else _repository = repository;
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
            else
            {
                base.Response = new MetricResponse(new ErrorDTO("EN", "A metric with such id does not exist", DateTime.Now));
                return false;
            }
        }
    }
}
