using Models.Models;

namespace Contracts.DTO
{
    public class DashboardComponentDto
    {
        public string Title { get; set; }
        public int Id { get; set; }
        public string CreationDate { get; set; }
        public string ModificationDate { get; set; }
        public int Type { get; set; }
        public string Definition { get; set; }
        public int DashboardId { get; set; }
    }
}
