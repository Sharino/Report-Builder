using Contracts.DTO;
using Models.Models;

namespace BussinessLogic.Mappings
{
    public class Mappings
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

        public MetricDTO MetricToDto(Metric metric)
        {
            var dto = new MetricDTO();

            dto.Description = metric.Description;
            dto.DisplayName = metric.DisplayName;
            dto.MetricId = metric.MetricId;
            dto.Group = metric.Group;

            return dto;
        }
    }
}
