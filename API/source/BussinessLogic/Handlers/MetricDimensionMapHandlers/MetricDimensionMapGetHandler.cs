using System;
using System.Collections.Generic;
using BussinessLogic.Handlers.Base;
using Contracts.DTO;
using Contracts.Responses;
using DataLayer.Repositories;
using BussinessLogic.Mappings;
using Logging;
using Models.Models;

namespace BussinessLogic.Handlers.MetricDimensionMapHandlers
{
    public class MetricDimensionMapGetHandler
    {
        public List<ErrorDto> Errors { get; set; }

        private readonly IMetricDimensionMapRepository _repository;
        public MetricDimensionMapGetHandler(IMetricDimensionMapRepository repository = null)
		{
			_repository = repository ?? new MetricDimensionMapRepository();
		}

        public  MetricDimensionMapResponse HandleCore()
		{
            var response = new MetricDimensionMapResponse();
            try
            {
                var MetricDimensions = new List<MetricMappings> { };
                for (int metricId = 1; metricId <= _repository.GetMetricCount(); metricId++)
                {
                    MetricDimensions.Add(new  MetricMappings { MetricId = metricId, DimensionIds = _repository.GetMetricDimensions(metricId)});
                }

                var DimensionMetrics = new List<DimensionMappings> { };
                for (int dimensionId = 1; dimensionId <= _repository.GetDimensionCount(); dimensionId++)
                {
                    DimensionMetrics.Add(new DimensionMappings { DimensionId = dimensionId, MetricIds = _repository.GetDimensionMetrics(dimensionId)});
                }

                response.DimensionMappings = DimensionMetrics;
                response.MetricMappings = MetricDimensions;

                return response;
            }
            catch (Exception exception)
            {
                Log _log = new Log("BaseHandler");
                Errors = new List<ErrorDto>();

                _log = new Log("Base handler");
                _log.Error(exception.ToString());

                Errors.Add(new ErrorDto("GenericError", "Generic error happened. Please contact customer support"));
            }
            return response;
		}
    }
}



           