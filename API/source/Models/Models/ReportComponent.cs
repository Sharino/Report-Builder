using System;
using Newtonsoft.Json;

namespace Models.Models
{
    public class ReportComponent
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime SubmissionDate { get; set; }
        public int Type { get; set; }
        public ReportComponentData Data { get; set; }
    }
}
