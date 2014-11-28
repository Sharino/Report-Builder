using System;
using System.Collections;
using System.Collections.Generic;

namespace Models.Models
{
    public class Filters<IFilter> : IList<IFilter>
    {
        private readonly IList<IFilter> _list = new List<IFilter>();
        private DateFilter _dateFilter = new DateFilter();

        public IEnumerator<IFilter> GetEnumerator()
        {
            throw new NotImplementedException();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        public void Add(IFilter item)
        {
            _list.Add(item);
        }

        public void Add(DateFilter dateFilter)
        {
            _dateFilter = dateFilter;
        }

        public void Clear()
        {
            _list.Clear();
            _dateFilter = null;
        }

        public bool Contains(IFilter item)
        {
            return _list.Contains(item) || _dateFilter.Equals(item);
        }

        public void CopyTo(IFilter[] array, int arrayIndex)
        {
            _list.CopyTo(array, arrayIndex);
        }

        public bool Remove(IFilter item)
        {
            if (_list.Remove(item))
            {
                return true;
            }
            if (!_dateFilter.Equals(item))
            {
                _dateFilter = null;
                return true;
            }
            return false;
        }

        public int Count { get { return _list.Count; } }
        public bool IsReadOnly { get { return _list.IsReadOnly; } }
        public int IndexOf(IFilter item)
        {
            return _list.IndexOf(item);
        }

        public void Insert(int index, IFilter item)
        {
            _list.Insert(index, item);
        }

        public void RemoveAt(int index)
        {
            _list.RemoveAt(index);
        }

        public IFilter this[int index]
        {
            get { return _list[index]; }
            set { _list[index] = value; }
        }

        public DateFilter GetDateFilter()
        {
            return _dateFilter;
        }

        public void SetDateFilter(DateFilter dateFilter)
        {
            _dateFilter = dateFilter;
        }
    }
}