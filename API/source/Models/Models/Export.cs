using System.Collections.Generic;

namespace Models.Models
{
    public class ExportValues
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }

    public class ExportRequest
    {
        public string Title { get; set; }
        public string Language { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string GeneratedDate { get; set; }
        public List<ExportValues> Values { get; set; }
    }
}
