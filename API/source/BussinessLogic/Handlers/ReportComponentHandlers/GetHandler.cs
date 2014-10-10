﻿using System;
using BussinessLogic.Handlers.Base;
using BussinessLogic.Mappings;
using Contracts.DTO;
using Contracts.Responses;
using DataLayer.Repositories;

namespace BussinessLogic.Handlers.ReportComponentHandlers
{
    public class GetHandler : BaseHandler<int, ReportComponentResponse>
    {
        private readonly IComponentRepository _repository;
        public GetHandler(IComponentRepository repository = null)
        {
            _repository = repository ?? new ComponentRepository();
        }

        public override ReportComponentResponse HandleCore(int request)
        {
            var mapping = new Mapping();
            var reportComponent = _repository.Get(request);
            var reportComponentDto = mapping.ReportComponentToDto(reportComponent);
            return new ReportComponentResponse(reportComponentDto);
        }

        public override bool Validate(int request)
        {
            if (_repository.Exists(request))
                return true;
            Response = new ReportComponentResponse(new ErrorDto("EN", "A report component with such id does not exist", DateTime.Now));
            return false;
        }
    }
}
