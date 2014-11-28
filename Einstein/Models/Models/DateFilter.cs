using System;

namespace Models.Models
{
    public class DateFilter : IFilter
    {
        public DateTime From { get; set; }
        public DateTime To { get; set; }
    }
}