using System;
using System.Collections.Generic;
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
            var errors = new List<ErrorDTO>();

            if (request.Title.Length > 30)
            {
                errors.Add(new ErrorDTO("EN", "The title cannot exceed 30 symbols", DateTime.Now));
            }
            if (request.Type < 1 || request.Type > 4)
            {
                errors.Add(new ErrorDTO("EN", "Provided Report Componing type is invalid", DateTime.Now));
            }
            if (errors.Count == 0) return true;
            base.Response = new ReportComponentResponse(errors);
            return false;
        }
    }
}
