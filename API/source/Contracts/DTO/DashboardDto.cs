using System.Collections.Generic;
using Models.Models;

namespace Contracts.DTO
{
    public class DashboardDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public List<int> ComponentIds { get; set; } 
    }
}
