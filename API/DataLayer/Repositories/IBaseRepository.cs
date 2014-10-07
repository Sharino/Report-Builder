using System.Collections.Generic;
using Models.Models;

namespace DataLayer.Repositories
{
    public interface IBaseRepository
    {
        IEnumerable<ReportComponent> GetAll();
        ReportComponent Get(int id);
        int Add(ReportComponent report);
        void Remove(int id);
        int Update(ReportComponent report);
        bool Exists(int id);
    }
}
