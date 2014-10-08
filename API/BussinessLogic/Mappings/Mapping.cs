using System;
using System.Collections.Generic;
using System.Linq;
using Contracts.DTO;
using Models.DTO;
using Models.Models;

namespace BussinessLogic.Mappings
{
    public class Mapping
    {
        public IEnumerable<MetricDTO> MetricToDto(IEnumerable<Metric> metrics)
        {
            var dtos = new List<MetricDTO>() {};
            foreach (var metric in metrics)
            {
                dtos.Add(MetricToDto(metric));
            }
            return dtos.AsEnumerable();
        }

        public MetricDTO MetricToDto(Metric metric)
        {
            var dto = new MetricDTO();
            dto.Description = metric.Description;
            dto.DisplayName = metric.DisplayName;
            dto.MetricId = metric.MetricId;
            dto.Group = metric.Group;
            return dto;
        }

        public ReportComponent DtoToReportComponent(ReportComponentDTO dto)
        {
            var report = new ReportComponent
            {
                Id = dto.Id,
                Title = dto.Title,
                SubmissionDate = DateTime.Now,
                Type = dto.Type
            };
            return report;
        }

        public ReportComponentDTO ReportComponentToDto(ReportComponent report)
        {
            var dto = new ReportComponentDTO
            {
                Id = report.Id, 
                Title = report.Title, 
                Type = report.Type
            };
            return dto;
        }

        public IEnumerable<ReportComponentDTO> ReportComponentToDto(IEnumerable<ReportComponent> components)
        {
            var dtos = new List<ReportComponentDTO>() { };
            foreach (var component in components)
            {
                dtos.Add(ReportComponentToDto(component));
            }
            return dtos.AsEnumerable();
        }

    }
}
