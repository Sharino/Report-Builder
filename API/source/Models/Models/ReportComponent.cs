using System;

namespace Models.Models
{
    public class ReportComponent
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string SubmissionDate { get; set; }
        public int Type { get; set; }
        public ReportComponentData Data { get; set; }
    }
}
