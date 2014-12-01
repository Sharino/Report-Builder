namespace Models.Models
{
    public class DashboardComponent
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string CreationDate { get; set; }
        public string ModificationDate { get; set; }
        public int Type { get; set; }
        public string Definition { get; set; }
        public int DashboardId { get; set; }
    }
}
