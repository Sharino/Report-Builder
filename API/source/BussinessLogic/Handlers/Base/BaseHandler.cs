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

        protected List<ErrorDto> Errors;

        public TResponse Handle(TRequest request)
        {
            try
            {
                if (Validate(request))
                    return HandleCore(request);
            }
            catch (Exception exception)
            {
                _log = new Log("Base handler");
                _log.Error(exception.ToString());

                Errors.Add(new ErrorDto("generalerror","General error happens please contact support",DateTime.UtcNow));
                return Response;
            }
            return Response;
        }

        public abstract TResponse HandleCore(TRequest request);
        public abstract bool Validate(TRequest request);
    }
}
