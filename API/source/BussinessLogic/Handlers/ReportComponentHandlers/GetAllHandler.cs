using System.Linq;
using BussinessLogic.Handlers.Base;
using BussinessLogic.Mappings;
using Contracts.Responses;
using DataLayer.Repositories;

namespace BussinessLogic.Handlers.ReportComponentHandlers
{
    public class GetAllHandler : BaseHandler<int, ReportComponentResponse>
    {
        private readonly IReportComponentRepository _repository;
        public GetAllHandler(IReportComponentRepository repository = null)
        {
            _repository = repository ?? new ReportComponentRepository();
        }

        public override ReportComponentResponse HandleCore(int request)
        {
            var mapping = new Mapping();
            var reportComponents = _repository.GetAll().OrderBy(x => x.Id).Reverse().ToList();
            var reportComponentDtos = mapping.ReportComponentToDto(reportComponents);
            return new ReportComponentResponse(reportComponentDtos);
        }

        public override bool Validate(int request)
        {
            return true;
        }
    }
}
