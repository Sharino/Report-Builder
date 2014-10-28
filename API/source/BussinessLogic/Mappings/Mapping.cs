using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;
using Contracts.DTO;
using Models.Models;

namespace BussinessLogic.Mappings
{
    public class Mapping
    {
        #region Dashboard Component

        public DashboardComponent ReportComponentToDashboardComponent(ReportComponent reportComponent)
        {
            var dashboardComponent = new DashboardComponent();
            dashboardComponent.Title = reportComponent.Title;
            dashboardComponent.Type = reportComponent.Type;

            var serializer = new JavaScriptSerializer();
            dashboardComponent.Definition = serializer.Serialize(reportComponent.Data);

            return dashboardComponent;
        }

        public DashboardComponent DtoToDashboardComponent(DashboardComponentDto dto)
        {
            var component = new DashboardComponent();
            component.DashboardId = dto.DashboardId;
            component.Definition = dto.Definition;
            component.Id = dto.Id;
            component.CreationDate = dto.CreationDate;
            component.Title = dto.Title;
            component.Type = dto.Type;

            return component;
        }

        public DashboardComponentDto DashboardComponentToDto(DashboardComponent component)
        {
            var dto = new DashboardComponentDto();
            dto.DashboardId = component.DashboardId;
            dto.Definition = component.Definition;
            dto.Id = component.Id;
            dto.CreationDate = component.CreationDate;
            dto.Title = component.Title;
            dto.Type = component.Type;

            return dto;
        }

        #endregion

        #region Dashboard

        public List<Dashboard> DtoToDashboard(List<DashboardDto> dtos)
        {
            return dtos.Select(DtoToDashboard).ToList();
        }

        public List<DashboardDto> ReportToDto(List<Dashboard> dashboards)
        {
            return dashboards.Select(DashboardToDto).ToList();
        }

        public Dashboard DtoToDashboard(DashboardDto dto)
        {
            var dashboard = new Dashboard();
            dashboard.ComponentIds = dto.ComponentIds;
            dashboard.Id = dto.Id;
            dashboard.Title = dto.Title;
            return dashboard;
        }

        public DashboardDto DashboardToDto(Dashboard dashboard)
        {
            var dto = new DashboardDto();
            dto.ComponentIds = dashboard.ComponentIds;
            dto.Id = dashboard.Id;
            dto.Title = dashboard.Title;
            return dto;
        }

        #endregion

        #region Metric

        public List<MetricDto> MetricToDto(List<Metric> metrics)
        {
            return metrics.Select(MetricToDto).ToList();
        }

        public MetricDto MetricToDto(Metric metric)
        {
            var dto = new MetricDto();
            dto.Description = metric.Description;
            dto.DisplayName = metric.DisplayName;
            dto.DataType = metric.DataType;
            dto.Mnemonic = metric.Mnemonic;
            dto.MetricId = metric.MetricId;
            dto.Group = metric.Group;
            return dto;
        }

        public List<Metric> DtoToMetric(List<MetricDto> dtos)
        {
            return dtos.Select(DtoToMetric).ToList();
        }

        public Metric DtoToMetric(MetricDto dto)
        {
            var metric = new Metric();
            metric.DataType = dto.DataType;
            metric.DisplayName = dto.DisplayName;
            metric.Description = dto.Description;
            metric.Group = dto.Group;
            metric.MetricId = dto.MetricId;
            metric.Mnemonic = dto.Mnemonic;
            return metric;
        }

        #endregion

        #region Report Component

        public ReportComponent DtoToReportComponent(ReportComponentDto dto)
        {
            var report = new ReportComponent
            {
                Id = dto.Id,
                Title = dto.Title,
                CreationDate = dto.SubmissionDate,
                Type = dto.Type,
                Data = new ComponentData { Dimensions = dto.Dimensions, Filters = dto.Filters, Metrics = DtoToMetric(dto.Metrics)}
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
                Metrics = MetricToDto(report.Data.Metrics),
                SubmissionDate = report.CreationDate,
                Dimensions = report.Data.Dimensions,
                Filters = report.Data.Filters
            };
            return dto;
        }

        public List<ReportComponent> DtoToReportComponent(List<ReportComponentDto> dtos)
        {
            return dtos.Select(DtoToReportComponent).ToList();
        }

        public List<ReportComponentDto> ReportComponentToDto(List<ReportComponent> components)
        {
            return components.Select(ReportComponentToDto).ToList();
        }

        #endregion
    }
}
