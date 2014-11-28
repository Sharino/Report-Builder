using System;
using System.Collections.Generic;
using Models.Models;
using Newtonsoft.Json;

namespace Contracts.DTO
{
    public interface IDimensionMetricPair
    {
        DimensionValuesList DimensionValues { get; set; }
        MetricValuesList MetricValues { get; set; }
    }

    public class DimensionMetricPair : IDimensionMetricPair
    {
        public DimensionValuesList DimensionValues { get; set; }
        public MetricValuesList MetricValues { get; set; }
    }


    public class EinsteinDTO
    {
        //public TupleList<List<DimensionValues>, List<MetricValues>> ComponentValues { get; set; }
        //public TupleList<DimensionValuesList, MetricValuesList> ComponentValues { get; set; } 
        public List<IDimensionMetricPair> ComponentValues { get; set; } 
    }
}