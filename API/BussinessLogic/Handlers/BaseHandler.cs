using Contracts.Responses;

namespace BussinessLogic.Handlers
{
    /// <summary>
    /// Abstract class from which all the handlers are derived. All methods must be implemented.
    /// </summary>
    /// <todo>
    /// Chain of Responsibility design pattern
    /// </todo>
    public abstract class BaseHandler<TRequest>
    {
        public BaseHandler<TRequest> Successor { protected get; set; }

        public abstract ReportComponentResponse Get(int id);
        public abstract ReportComponentResponse GetAll();
        public abstract ReportComponentResponse Add(TRequest reportComponentDto);
        public abstract ReportComponentResponse Remove(int id);
    }
}
