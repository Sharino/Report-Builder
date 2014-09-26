using DataLayer.Base;
using Logging;
using Models.Models;
using System.Collections.Generic;

namespace BussinessLogic.Handlers
{
    public class ReportComponentHandler
    {
        protected ComponentRepository ComponentRepository;

        public ReportComponentHandler()
        {
            ComponentRepository = new ComponentRepository();
        }
 
        public int Add(ReportComponent report)
        {
            //TODO:Refactor to base handler
            if (report != null)
            {
                if (report.Title.Length < 30)
                {
                    int id = ComponentRepository.Add(report);
                    return id;
                }
                 //TODO:Refactor to base handler
                //else
                //{
                //    Log.Warn("Report Component title is too long", report);
                //}
            }

            //TODO:Refactor to base handler
            //Log.Warn("Unable to add a report", report);
            return -1;
        }

        public IEnumerable<ReportComponent> GetAll()
        {
            return ComponentRepository.GetAll();
        }

        public ReportComponent Get(int id)
        {
            Log.Debug("Saying hi from ReportHandler at namespace BussinessLogic");
            var item = ComponentRepository.Get(id);

            return item;
        }

        public void Remove(int id)
        {
            ComponentRepository.Remove(id);
        }
    }
}