using System;
using System.Collections.Generic;
using Contracts.DTO;
using Logging;

namespace BussinessLogic.Handlers.Base
{
    public abstract class BaseHandler<TRequest, TResponse>
    {
        protected TResponse Response;
        private Log _log;

        public List<ErrorDto> Errors;

        public TResponse Handle(TRequest request)
        {
            try
            {
                Errors = new List<ErrorDto>();
                if (Validate(request))
                    return HandleCore(request);
            }
            catch (Exception exception)
            {
                _log = new Log("Base handler");
                _log.Error(exception.ToString());

                Errors.Add(new ErrorDto("GenericError", "Generic error happened. Please contact customer support"));
                return Response;
            }
            return Response;
         }

        public abstract TResponse HandleCore(TRequest request);
        public abstract bool Validate(TRequest request);
    }
}
