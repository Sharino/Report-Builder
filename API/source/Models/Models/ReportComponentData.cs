using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Models.Models
{
    public class ReportComponentData
    {
        [JsonProperty("Metrics")]
        public List<Metric> Metrics { get; set; }
        [JsonProperty("Dimensions")]
        public List<Dimension> Dimensions { get; set; }
        [JsonProperty("Filters")]
        public List<Filter> Filters { get; set; }
    }
}
