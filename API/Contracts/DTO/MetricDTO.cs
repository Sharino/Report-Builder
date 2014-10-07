using Models.Models;

namespace Contracts.DTO
{
    public class MetricDTO
    {
        public int MetricId { get; set; }
        public MetricGroup Group { get; set; }
        public string DisplayName { get; set; }
        public string Description { get; set; }
    }
}
