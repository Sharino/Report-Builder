using System.Collections.Generic;

namespace Models.Models
{
    public class ReportComponentData
    {
        public List<Metric> Metrics { get; set; }
        public List<Dimension> Dimensions { get; set; }
        public List<Filter> Filters { get; set; }
    }
}
