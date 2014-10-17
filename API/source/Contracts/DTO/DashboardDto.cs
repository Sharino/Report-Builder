using System.Collections.Generic;

namespace Contracts.DTO
{
    public class DashboardDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public List<int> Components { get; set; } 
    }
}
