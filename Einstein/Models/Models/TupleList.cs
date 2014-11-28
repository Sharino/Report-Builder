using System;
using System.Collections.Generic;

namespace Models.Models
{
    public class TupleList<T1, T2> : List<Tuple<T1, T2>>
    {
        public void Add(T1 dimensionValues, T2 metricValues)
        {
            Add(new Tuple<T1, T2>(dimensionValues, metricValues));
        }
    }

}
