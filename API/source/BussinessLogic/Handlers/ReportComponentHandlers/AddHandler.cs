using System;
using System.Linq;
using BussinessLogic.Handlers.Base;
using BussinessLogic.Mappings;
using Contracts.DTO;
using Contracts.Responses;
using DataLayer.Repositories;
using Models.Models;

namespace BussinessLogic.Handlers.ReportComponentHandlers
{
    public class AddHandler : BaseHandler<ReportComponentDto, ReportComponentResponse>
    {
        private readonly IReportComponentRepository _repository;
        public AddHandler(IReportComponentRepository repository = null)
        {
            _repository = repository ?? new ReportComponentRepository();
        }

        public override ReportComponentResponse HandleCore(ReportComponentDto request)
        {
            var mapping = new Mapping();
            request.SubmissionDate = DateTime.UtcNow.ToString();
            ReportComponent reportComponent = mapping.DtoToReportComponent(request);
            int id = _repository.Add(reportComponent);
            request.Id = id;
            return new ReportComponentResponse(request);
        }

        public override bool Validate(ReportComponentDto request)
        {
            if (request.Type != 1)
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

            if (request.Type == 3)
            {
                if (request.Dimensions.Any(dimension => dimension.Group.GroupName.ToLower() != "time"))
                {
                    Errors.Add(new ErrorDto("EN", "Timeline component can only have dimensions with Time category"));
                }
            }

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