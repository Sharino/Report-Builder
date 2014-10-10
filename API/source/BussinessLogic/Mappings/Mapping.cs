using System;
using System.Collections.Generic;
using System.Linq;
using Contracts.DTO;
using Models.Models;

namespace BussinessLogic.Mappings
{
    public class Mapping
    {
        public IEnumerable<MetricDto> MetricToDto(IEnumerable<Metric> metrics)
        {
            var dtos = new List<MetricDto>();
            dtos.AddRange(metrics.Select(MetricToDto));
            return dtos.AsEnumerable();
        }

        public MetricDto MetricToDto(Metric metric)
        {
            var dto = new MetricDto();
            dto.Description = metric.Description;
            dto.DisplayName = metric.DisplayName;
            dto.MetricId = metric.MetricId;
            dto.Group = metric.Group;
            return dto;
        }

        public ReportComponent DtoToReportComponent(ReportComponentDto dto)
        {
            var report = new ReportComponent
            {
                Id = dto.Id,
                Title = dto.Title,
                SubmissionDate = DateTime.Now,
                Type = dto.Type,
                Data = new ReportComponentData { Dimensions = dto.Dimensions, Filters = dto.Filters, Metrics = dto.Metrics }
            };
            return report;
        }

        public ReportComponentDto ReportComponentToDto(ReportComponent report)
        {
            var dto = new ReportComponentDto
            {
                Id = report.Id, 
                Title = report.Title, 
                Type = report.Type,
                Metrics = report.Data.Metrics,
                Dimensions = report.Data.Dimensions,
                Filters = report.Data.Filters
            };
            return dto;
        }

        public IEnumerable<ReportComponentDto> ReportComponentToDto(IEnumerable<ReportComponent> components)
        {
            var dtos = new List<ReportComponentDto>();
            dtos.AddRange(components.Select(ReportComponentToDto));
            return dtos.AsEnumerable();
        }

    }
}
