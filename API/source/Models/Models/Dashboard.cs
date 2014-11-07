using System.Collections.Generic;

namespace Models.Models
{
    public class Dashboard
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public List<int> ComponentIds { get; set; }
    }
}
