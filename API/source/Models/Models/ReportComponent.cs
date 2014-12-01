using System;

namespace Models.Models
{
    public class ReportComponent
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string CreationDate { get; set; }
        public string ModificationDate { get; set; }
        public int Type { get; set; }
        public ComponentData Data { get; set; }
    }
}
