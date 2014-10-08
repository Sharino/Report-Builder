using System;
using BussinessLogic.Mappings;
using Contracts.DTO;
using Contracts.Responses;
using DataLayer.Base;
using Models.DTO;
using Models.Models;

namespace BussinessLogic.Handlers
{
    public class UpdateHandler : BaseHandler<ReportComponentDTO, ReportComponentResponse>
    {
        private readonly IComponentRepository _repository;
        public UpdateHandler(IComponentRepository repository = null)
        {
            if (repository == null)
                _repository = new ComponentRepository();
            else _repository = repository;
        }

        public override ReportComponentResponse HandleCore(ReportComponentDTO request)
        {
            Mapping mapping = new Mapping();
            ReportComponent reportComponent = mapping.DtoToReportComponent(request);
            int id = _repository.Update(reportComponent);
            request.Id = id;
            return new ReportComponentResponse(request);
        }

        public override bool Validate(ReportComponentDTO request)
        {
            if (request.Title.Length > 30)
            {
                base.Response =
                    new ReportComponentResponse(new ErrorDTO("EN", "The title cannot exceed 30 symbols", DateTime.Now));
                return false;
            }
            if (request.Type < 1 || request.Type > 4)
            {
                base.Response =
                    new ReportComponentResponse(new ErrorDTO("EN", "Provided Report Componing type is invalid", DateTime.Now));
                return false;
            }
            return true;
        }
    }
}
