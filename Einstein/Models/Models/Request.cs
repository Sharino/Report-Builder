using System;
using System.Collections.Generic;
namespace Models.Models
{
    public class Request
    {
        public List<string> Metrics { get; set; }
        public List<string> Dimensions { get; set; }
        //public Filters<IFilter> Filters { get; set; } 
        public FiltersWow Filters { get; set; }
    }
}