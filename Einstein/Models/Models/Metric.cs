namespace Models.Models
{
    public class Metric
    {
        public int MetricId { get; set; }
        public string Mnemonic { get; set; }
        public MetricGroup Group { get; set; }
        public string DisplayName { get; set; }
        public string Description { get; set; }
        public string DataType { get; set; }
    }
    public class MetricGroup
    {
        public int GroupId { get; set; }
        public string GroupName { get; set; }
    }
}