using System.Collections.Generic;
using Contracts.DTO;

namespace Contracts.Responses
{
    /// <summary>
    /// This response should contain either ErrorDTO (code, msg, timestamp) or Metric(s) if the operation is successful
    /// </summary>
    public class MetricResponse
    {
        public MetricResponse(MetricDto metricDto)
        {
            Errors = null;
            MetricDtos = new List<MetricDto>{metricDto};
        }

        public MetricResponse(List<MetricDto> metricDtos)
        {
            Errors = null;
            MetricDtos = metricDtos;
        }

        public MetricResponse(ErrorDto errorDto)
        {
            MetricDtos = null;
            Errors = new List<ErrorDto>{errorDto};
        }

        public MetricResponse(List<ErrorDto> errorDtos)
        {
            MetricDtos = null;
            Errors = errorDtos;
        }


        public List<ErrorDto> Errors { get; set; }
        public List<MetricDto> MetricDtos { get; set; }
    }
}
