using System;
using System.Collections.Generic;
using Models.Models;

namespace Contracts.DTO
{
    public class ReportComponentDto
    {   //TODO dimensionsDTO filtersDTO
        public string Title { get; set; }
        public int Id { get; set; }
        public string SubmissionDate { get; set; }
        public int Type { get; set; }
        public List<MetricDto> Metrics { get; set; }
        public List<Dimension> Dimensions { get; set; }
        public List<Filter> Filters { get; set; }
    }
}
