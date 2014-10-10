using System.Collections.Generic;
using Models.Models;

namespace Contracts.DTO
{
    public class ReportComponentDto
    {
        public string Title { get; set; }
        public int Id { get; set; }
        public int Type { get; set; }
        public List<Metric> Metrics { get; set; }
        public List<Dimension> Dimensions { get; set; }
        public List<Filter> Filters { get; set; }
    }
}
