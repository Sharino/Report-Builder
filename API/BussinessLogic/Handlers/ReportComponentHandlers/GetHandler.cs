using System;
using AutoMapper;
using BussinessLogic.Mappings;
using Contracts.DTO;
using Contracts.Responses;
using DataLayer.Base;
using Models.DTO;
using Models.Models;

namespace BussinessLogic.Handlers
{
    public class GetHandler : BaseHandler<int, ReportComponentResponse>
    {
        private readonly IComponentRepository _repository;
        public GetHandler(IComponentRepository repository = null)
        {
            if (repository == null)
                _repository = new ComponentRepository();
            else _repository = repository;
        }

        public override ReportComponentResponse HandleCore(int request)
        {
            Map.MapReportComponents();
            var reportComponent = _repository.Get(request);
            ReportComponentDTO reportComponentDto = Mapper.Map<ReportComponent, ReportComponentDTO>(reportComponent);
            return new ReportComponentResponse(reportComponentDto);
        }

        public override bool Validate(int request)
        {
            if (_repository.Exists(request))
                return true;
            else
            {
                base.Response = new ReportComponentResponse(new ErrorDTO("EN", "A report component with such id does not exist", DateTime.Now));
                return false;
            }
        }
    }
}
