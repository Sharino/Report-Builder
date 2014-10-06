using System;
using System.Collections.Generic;
using Contracts.DTO;

namespace BussinessLogic.Handlers
{
    public abstract class BaseHandler<TRequest, TResponse>
    {
        protected TResponse Response;

        public List<ErrorDTO> VAlidationMessages; 

        public TResponse Handle(TRequest request)
        {
            try
            {
                if (Validate(request))
                    return HandleCore(request);
            }
            catch (Exception exception)
            {
                return Response;
            }
            return Response;
        }

        public abstract TResponse HandleCore(TRequest request);
        public abstract bool Validate(TRequest request);
    }
}
