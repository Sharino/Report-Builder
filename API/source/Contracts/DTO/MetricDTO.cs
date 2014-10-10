using Models.Models;

namespace Contracts.DTO
{
    public class MetricDto
    {
        public int MetricId { get; set; }
        public MetricGroup Group { get; set; }
        public string DisplayName { get; set; }
        public string Description { get; set; }
        public string DataType { get; set; }
    }
}
