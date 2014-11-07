using Models.Models;

namespace Contracts.DTO
{
	public class DimensionDto
	{
		public int DimensionId { get; set; }
		public DimensionGroup Group { get; set; }
		public string DisplayName { get; set; }
		public string Description { get; set; }
		public string DataType { get; set; }
		public string Mnemonic { get; set; }
	}
}
