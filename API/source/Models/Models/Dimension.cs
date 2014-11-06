namespace Models.Models
{
	public class Dimension
	{
		public int DimensionId { get; set; }
		public string Mnemonic { get; set; }
		public DimensionGroup Group { get; set; }
		public string DisplayName { get; set; }
		public string Description { get; set; }
		public string DataType { get; set; }
	}

	public class DimensionGroup
    {
        public int GroupId { get; set; }
        public string GroupName { get; set; }
    }
}