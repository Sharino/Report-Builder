using System.Collections.Generic;
using Contracts.DTO;

namespace Contracts.Responses
{
	public class DimensionResponse
	{
		public DimensionResponse(DimensionDto dimensionDto)
		{
			DimensionDtos = new List<DimensionDto> { dimensionDto };
		}

		public DimensionResponse(List<DimensionDto> dimensionDtos)
		{
			DimensionDtos = dimensionDtos;
		}

		public List<DimensionDto> DimensionDtos { get; set; }
	}
}
