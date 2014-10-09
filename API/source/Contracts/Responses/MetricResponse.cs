using System.Collections.Generic;
using Contracts.DTO;

namespace Contracts.Responses
{
    /// <summary>
    /// This response should contain either ErrorDTO (code, msg, timestamp) or Metric(s) if the operation is successful
    /// </summary>
    public class MetricResponse
    {
        public MetricResponse(MetricDTO metricDto)
        {
            Errors = null;
            MetricDtos = new List<MetricDTO>{metricDto};
        }

        public MetricResponse(List<MetricDTO> metricDtos)
        {
            Errors = null;
            MetricDtos = metricDtos;
        }

        public MetricResponse(ErrorDTO errorDto)
        {
            MetricDtos = null;
            Errors = new List<ErrorDTO>{errorDto};
        }

        public MetricResponse(List<ErrorDTO> errorDtos)
        {
            MetricDtos = null;
            Errors = errorDtos;
        }


        public List<ErrorDTO> Errors { get; set; }
        public List<MetricDTO> MetricDtos { get; set; }
    }
}
