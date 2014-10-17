using System.Collections.Generic;
using Contracts.DTO;

namespace Contracts.Responses
{
    public class MetricResponse
    {
        public MetricResponse(MetricDto metricDto)
        {
            MetricDtos = new List<MetricDto>{metricDto};
        }

        public MetricResponse(List<MetricDto> metricDtos)
        {
            MetricDtos = metricDtos;
        }

        public List<MetricDto> MetricDtos { get; set; }
    }
}
