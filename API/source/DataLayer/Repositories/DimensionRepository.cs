using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using Models.Models;
using System.Collections.Generic;


namespace DataLayer.Repositories
{
	public interface IDimensionsRepository
	{
		IEnumerable<Dimension> GetAll();
		Dimension Get(int id);
		bool Exists(int id);
	}

	public class DimensionRepository: IDimensionsRepository
	{
		private readonly SqlConnection _connection;

		public DimensionRepository()
		{
			_connection = CreateDbConnection();
		}

		private SqlConnection CreateDbConnection()
		{
			var connectionString = ConfigurationManager.AppSettings["connectionString"];
			return new SqlConnection(connectionString);
		}

		public IEnumerable<Dimension> GetAll()
		{
			var list = new List<Dimension>();
			_connection.Open();
			const string sql = @"SELECT [dbo].[Dimensions].*, [dbo].[DimensionDescriptions].Description, [dbo].[DimensionName].DisplayName, [dbo].[DimensionGroups].*
	                        FROM [dbo].[Dimensions] 
	                        JOIN [dbo].[DimensionDescriptions]
		                        ON [dbo].[Dimensions].ID = [dbo].[DimensionDescriptions].DimensionID
	                        JOIN [dbo].[DimensionName]
		                        ON [dbo].[Dimensions].ID = [dbo].[DimensionName].DimensionID
	                        LEFT JOIN [dbo].[DimensionGroupDimension]
		                        ON  [dbo].[Dimensions].ID = [dbo].[DimensionGroupDimension].DimensionID
	                        LEFT JOIN [dbo].[DimensionGroups]	
		                        ON [dbo].[DimensionGroups].ID = [dbo].[DimensionGroupDimension].GroupID";

			using (var command = new SqlCommand(sql, _connection))
			{

				using (var reader = command.ExecuteReader())
				{
					while (reader.Read())
					{
						var component = new Dimension();
						component.DimensionId = reader.GetInt32(0);
						component.Mnemonic = reader.GetString(1);
						component.DataType = reader.GetString(2);
						component.Description = reader.GetString(3);
						component.DisplayName = reader.GetString(4);
						component.Group = new DimensionGroup
						{
							GroupId = reader.GetInt32(5),
							GroupName = reader.GetString(6)
						};

						list.Add(component);
					}
				}
			}
			_connection.Close();
			return list.OrderBy(x => x.Group.GroupId).AsEnumerable();
		}

		public Dimension Get(int id)
		{
			const string sql = @"SELECT [dbo].[Dimensions].*, [dbo].[DimensionDescriptions].Description, [dbo].[DimensionName].DisplayName, [dbo].[DimensionGroups].*
	                        FROM [dbo].[Dimensions] 
	                        JOIN [dbo].[DimensionDescriptions]
		                        ON [dbo].[Dimensions].ID = [dbo].[DimensionDescriptions].DimensionID
	                        JOIN [dbo].[DimensionName]
		                        ON [dbo].[Dimensions].ID = [dbo].[DimensionName].DimensionID
	                        LEFT JOIN [dbo].[DimensionGroupDimension]
		                        ON  [dbo].[Dimensions].ID = [dbo].[DimensionGroupDimension].DimensionID
	                        LEFT JOIN [dbo].[DimensionGroups]
		                        ON [dbo].[DimensionGroups].ID = [dbo].[DimensionGroupDimension].GroupID
	                        WHERE [dbo].[Dimensions].ID = @DimensionId ";

			using (var command = new SqlCommand(sql, _connection))
			{
				_connection.Open();
				command.Parameters.AddWithValue("@DimensionId", id);
				using (var reader = command.ExecuteReader())
				{
					reader.Read();
					var item = new Dimension
					{
						DimensionId = reader.GetInt32(0),
						Mnemonic = reader.GetString(1),
						DataType = reader.GetString(2),
						Description = reader.GetString(3),
						DisplayName = reader.GetString(4),
						Group = new DimensionGroup
						{
							GroupId = reader.GetInt32(5),
							GroupName = reader.GetString(6)
						}
					};
					_connection.Close();
					return item;
				}
			}
		}

		public bool Exists(int id)
		{
			const string sql = @"SELECT COUNT(*) FROM [dbo].[Dimensions] WHERE [ID] = @DimensionId";
			using (var command = new SqlCommand(sql, _connection))
			{
				_connection.Open();

				command.Parameters.AddWithValue("@DimensionId", id);
				int count = (int)command.ExecuteScalar();

				_connection.Close();
				return count > 0;
			}
		}
	}
}
