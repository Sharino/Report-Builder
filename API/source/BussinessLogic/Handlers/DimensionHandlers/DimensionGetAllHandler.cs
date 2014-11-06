using System.Linq;
using BussinessLogic.Handlers.Base;
using BussinessLogic.Mappings;
using Contracts.Responses;
using DataLayer.Repositories;

namespace BussinessLogic.Handlers.DimensionHandlers
{
	public class DimensionGetAllHandler : BaseHandler<int, DimensionResponse>
	{
		private readonly IDimensionsRepository _repository;

		public DimensionGetAllHandler(IDimensionsRepository repository = null)
		{
			_repository = repository ?? new DimensionRepository();
		}

		public override DimensionResponse HandleCore(int request)
		{
			var mapper = new Mapping();
			var dimensions = _repository.GetAll().OrderBy(x => x.Group.GroupId).ToList();
			var dtos = mapper.DimensionToDto(dimensions);
			return new DimensionResponse(dtos.ToList());
		}

		public override bool Validate(int request)
		{
			return true;
		}
	}
}
