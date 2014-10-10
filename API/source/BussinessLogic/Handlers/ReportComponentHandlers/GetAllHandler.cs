
using System.Linq;
using BussinessLogic.Mappings;
using Contracts.Responses;
using DataLayer.Base;

namespace BussinessLogic.Handlers.Base
{
    public class GetAllHandler : BaseHandler<int, ReportComponentResponse>
    {
        
        private readonly IComponentRepository _repository;
        public GetAllHandler(IComponentRepository repository = null)
        {
            if (repository == null) 
                _repository = new ComponentRepository();
            else _repository = repository;
        }
        public override ReportComponentResponse HandleCore(int request)
        {
            Mapping mapping = new Mapping();
            var reportComponents = _repository.GetAll().OrderBy(x => x.Id);
            var reportComponentDtos = mapping.ReportComponentToDto(reportComponents);
            return new ReportComponentResponse(reportComponentDtos.ToList());
        }

        public override bool Validate(int request)
        {
            return true;
        }
    }
}
