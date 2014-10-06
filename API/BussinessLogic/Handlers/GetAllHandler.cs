using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using BussinessLogic.Mappings;
using Contracts.Responses;
using DataLayer.Base;
using DataLayer.Repositories;
using Models.DTO; 
using Models.Models;

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
            Map.MapReportComponents();
            var reportComponents = _repository.GetAll().OrderBy(x => x.Id);
            var reportComponentDtos = Mapper.Map<IEnumerable<ReportComponent>, IEnumerable<ReportComponentDTO>>(reportComponents);
            return new ReportComponentResponse(reportComponentDtos.ToList());
        }

        public override bool Validate(int request)
        {
            return true;
        }
    }
}
