using System.Collections.Generic;
using Contracts.DTO;
using Models.Models;

namespace Contracts.Responses
{
    public class MetricDimensionMapResponse
    {
        public List<MetricMappings> MetricMappings { get; set; }
        public List<DimensionMappings> DimensionMappings { get; set; }
    }
}
