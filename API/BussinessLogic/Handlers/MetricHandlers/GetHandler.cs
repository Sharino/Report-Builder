using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Contracts.Responses;

namespace BussinessLogic.Handlers.MetricHandlers
{
    public class GetHandler : BaseHandler<int, MetricResponse>
    {
        public override MetricResponse HandleCore(int request)
        {
            throw new NotImplementedException();
        }

        public override bool Validate(int request)
        {
            throw new NotImplementedException();
        }
    }
}
