using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Models
{
    public class MetricMappings
    {
        public int MetricId { get; set; }
        public List<int> DimensionIds { get; set; }
    }

    public class DimensionMappings
    {
        public int DimensionId { get; set; }
        public List<int> MetricIds { get; set; } 
    }
    
}
