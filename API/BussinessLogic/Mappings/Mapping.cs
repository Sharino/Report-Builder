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
        public Metric DtoToMetric(MetricDTO dto)
        {
            var metric = new Metric();

            metric.Description = dto.Description;
            metric.DisplayName = dto.DisplayName;
            metric.Group = dto.Group;
            metric.MetricId = dto.MetricId;
            //metric.Mnemonic = ?

            return metric;
        }

        public IEnumerable<MetricDTO> MetricToDto(List<Metric> metrics)
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
            var report = new ReportComponent();

            report.Id = dto.Id;
            report.Title = dto.Title;
            report.SubmissionDate = DateTime.Now;
            report.ComponentType = 1;

            return report;
        }

        public ReportComponentDTO ReportComponentToDto(ReportComponent report)
        {
            var dto = new ReportComponentDTO();

            dto.Id = report.Id;
            dto.Title = report.Title;

            return dto;
        }

    }
}
