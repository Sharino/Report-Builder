using System;
using System.Collections.Generic;
using Contracts.DTO;
using Contracts.Responses;
using Logging;

namespace BussinessLogic.Handlers
{
    public abstract class BaseHandler<TRequest, TResponse>
    {
        protected TResponse Response;
        private Log Log;

        protected List<ErrorDTO> Errors;

        public TResponse Handle(TRequest request)
        {
            try
            {
                if (Validate(request))
                    return HandleCore(request);
            }
            catch (Exception exception)
            {
                Log = new Log("Base handler");
                Log.Error(exception.ToString());
                return Response;
            }
            return Response;
        }

        public abstract TResponse HandleCore(TRequest request);
        public abstract bool Validate(TRequest request);
    }
}
