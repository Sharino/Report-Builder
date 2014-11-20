using System;
using BussinessLogic.Handlers.Base;
using BussinessLogic.Mappings;
using Contracts.DTO;
using Contracts.Responses;
using DataLayer.Repositories;

namespace BussinessLogic.Handlers.ReportComponentHandlers
{
    public class UpdateHandler : BaseHandler<ReportComponentDto, ReportComponentResponse>
    {
        private readonly IReportComponentRepository _repository;
        public UpdateHandler(IReportComponentRepository repository = null)
        {
            _repository = repository ?? new ReportComponentRepository();
        }

        public override ReportComponentResponse HandleCore(ReportComponentDto request)
        {
            var mapping = new Mapping();
            var reportComponent = mapping.DtoToReportComponent(request);
            int id = _repository.Update(reportComponent);
            request.Id = id;
            return new ReportComponentResponse(request);
        }

        public override bool Validate(ReportComponentDto request)
        {
            if (!request.Type.Equals(1))
            {
                var dimensions = request.Dimensions;
                var metrics = request.Metrics;
                var map = new ReportComponentRepository();

                foreach (var metric in metrics)
                {
                    foreach (var dimension in dimensions)
                    {
                        if (!map.MetricDimensionMetricRelations(metric.MetricId, dimension.DimensionId))
                        {
                            Errors.Add(new ErrorDto("EN", "Report Component Metrics doesn't map with Dimensions"));
                        }

                    }
                }
            }

            if (!_repository.Exists(request.Id))
                Errors.Add(new ErrorDto("404", "A Report Component with such ID does not exist"));
            if (request.Title.Length > 30)
            {
                Errors.Add(new ErrorDto("EN", "Report Component title cannot exceed 30 symbols"));
            }
            if (request.Type < 1 || request.Type > 4)
            {
                Errors.Add(new ErrorDto("EN", "Provided Report Componing type is invalid"));
            }
            return Errors.Count == 0;
        }
    }
}
