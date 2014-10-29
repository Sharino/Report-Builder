using System;
using BussinessLogic.Handlers.Base;
using BussinessLogic.Mappings;
using Contracts.DTO;
using Contracts.Responses;
using DataLayer.Repositories;

namespace BussinessLogic.Handlers.ReportComponentHandlers
{
    public class DeleteHandler : BaseHandler<int, ReportComponentResponse>
    {
        private readonly IReportComponentRepository _repository;
        public DeleteHandler(IReportComponentRepository repository = null)
        {
            _repository = repository ?? new ReportComponentRepository();
        }

        public override ReportComponentResponse HandleCore(int request)
        {
            var mapping = new Mapping();
            var toDelete = mapping.ReportComponentToDto(_repository.Get(request));
            _repository.Remove(request);
            return new ReportComponentResponse(toDelete);
        }

        public override bool Validate(int request)
        {
            if (_repository.Exists(request))
                return true;
            Errors.Add(new ErrorDto("EN", "A Report Component with such id does not exist"));
            return false;
        }
    }
}
