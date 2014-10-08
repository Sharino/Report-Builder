using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using BussinessLogic.Mappings;
using Contracts.DTO;
using Contracts.Responses;
using DataLayer.Repositories;
using Models.Models;

namespace BussinessLogic.Handlers.MetricHandlers
{
    public partial class MetricGetAllHandler : BaseHandler<int, MetricResponse>
    {
        private readonly IMetricsRepository _repository;

        public MetricGetAllHandler(IMetricsRepository repository = null)
        {
            if (repository == null)
                _repository = new MetricRepository();
            else _repository = repository;
        }
        public override MetricResponse HandleCore(int request)
        {
            var mapper = new Mapping();
            var metrics = _repository.GetAll().OrderBy(x => x.MetricId);
            var dtos = mapper.MetricToDto(metrics);
            return new MetricResponse(dtos.ToList());
        }

        public override bool Validate(int request)
        {
            return true;
        }
    }
}
