using System;
using BussinessLogic.Handlers.Base;
using Contracts.DTO;
using Contracts.Responses;
using DataLayer.Repositories;
using BussinessLogic.Mappings;

namespace BussinessLogic.Handlers.DimensionHandlers
{
	public class DimensionGetHandler : BaseHandler<int, DimensionResponse>
	{
		private readonly IDimensionsRepository _repository;
		public DimensionGetHandler(IDimensionsRepository repository = null)
		{
			_repository = repository ?? new DimensionRepository();
		}

		public override DimensionResponse HandleCore(int request)
		{
			var mapper = new Mapping();
			var dimension = _repository.Get(request);
			return new DimensionResponse(mapper.DimensionToDto(dimension));
		}

		public override bool Validate(int request)
		{
			if (_repository.Exists(request))
				return true;
			Errors.Add(new ErrorDto("EN", "A dimension with such id does not exist"));
			return false;
		}
	}
}
