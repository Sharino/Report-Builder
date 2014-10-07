using System;
using System.Collections.Generic;
using AutoMapper;
using BussinessLogic.Mapping;
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
            Map.MapReportComponents();
            ReportComponent reportComponent = Mapper.Map<ReportComponentDTO, ReportComponent>(request);
            int id = _repository.Update(reportComponent);
            request.Id = id;
            return new ReportComponentResponse(request);
        }

        public override bool Validate(ReportComponentDTO request)
        {
            var sth = new List<ErrorDTO>()
            {
                new ErrorDTO("LT", "Pir doug simbeliu ividei", DateTime.Now),
                new ErrorDTO("EN", "The title cannot exceed 30 symbols", DateTime.Now)
            };
            if (request.Title.Length > 30)
            {
                base.Response = new ReportComponentResponse(
                    new List<ErrorDTO>()
                    {
                        new ErrorDTO("LT", "Pir doug simbeliu ividei", DateTime.Now),
                        new ErrorDTO("EN", "The title cannot exceed 30 symbols", DateTime.Now)
                    });
                return false;
            }
            return true;
        }
    }
}
