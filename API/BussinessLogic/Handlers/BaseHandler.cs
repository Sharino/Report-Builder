using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Contracts.Responses;

namespace BussinessLogic.Handlers
{
    public abstract class BaseHandler<TRequest>
    {
        public BaseHandler<TRequest> Successor { protected get; set; }

        public abstract ReportComponentResponse Get(int id);
        public abstract ReportComponentResponse GetAll();
        public abstract ReportComponentResponse Add(TRequest reportComponentDto);
        public abstract ReportComponentResponse Remove(int id);

    }
}
