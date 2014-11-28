using System.Collections.Generic;
using Models.Models;
namespace Contracts.DTO
{
    public class IdFilter : IFilter
    {
        public List<int> MetricValues { get; set; }
    }
}