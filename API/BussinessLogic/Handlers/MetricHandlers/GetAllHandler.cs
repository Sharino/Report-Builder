using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using BussinessLogic.Mappings;
using Contracts.DTO;
using Contracts.Responses;
using DataLayer.Repositories;
using Models.DTO;
using Models.Models;

namespace BussinessLogic.Handlers.MetricHandlers
{
    public partial class GetAllHandler : BaseHandler<int, MetricResponse>
    {
        private readonly IMetricsRepository _repository;

        public GetAllHandler(IMetricsRepository repository = null)
        {
            if (repository == null)
                _repository = new MetricRepository();
            else _repository = repository;
        }
        public override MetricResponse HandleCore(int request)
        {
            Map.MapReportComponents();
            var metrics = _repository.GetAll().OrderBy(x => x.MetricId);
            var metricDtos = Mapper.Map<IEnumerable<Metric>, IEnumerable<MetricDTO>>(metrics);
            return new MetricResponse(metricDtos.ToList());
        }

        public override bool Validate(int request)
        {
            return true;
        }
    }
}
