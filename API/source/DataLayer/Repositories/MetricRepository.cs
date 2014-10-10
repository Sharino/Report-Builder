using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using Models.Models;

namespace DataLayer.Repositories
{
    public interface IMetricsRepository
    {
        IEnumerable<Metric> GetAll();
        Metric Get(int id);
        bool Exists(int id);
    }

    public class MetricRepository : IMetricsRepository
    {
        private readonly SqlConnection _connection;

        public MetricRepository()
        {
            _connection = CreateDbConnection();
        }

        private static SqlConnection CreateDbConnection()
        {
            var connectionString = ConfigurationManager.AppSettings["connectionString"];
            return new SqlConnection(connectionString);
        }

        public IEnumerable<Metric> GetAll()
        {
            var list = new List<Metric>();
            _connection.Open();
            const string sql = @" SELECT [dbo].[Metrics].*, [dbo].[MetricDescriptions].Description, [dbo].[MetricName].DisplayName, [dbo].[MetricGroups].*
	                        FROM [dbo].[Metrics] 
	                        JOIN [dbo].[MetricDescriptions]
		                        ON [dbo].[Metrics].ID = [dbo].[MetricDescriptions].MetricID
	                        JOIN [dbo].[MetricName]
		                        ON [dbo].[Metrics].ID = [dbo].[MetricName].MetricID
	                        LEFT JOIN [dbo].[MetricGroupMetric]
		                        ON  [dbo].[Metrics].ID = [dbo].[MetricGroupMetric].MetricID
	                        LEFT JOIN [dbo].[MetricGroups]	
		                        ON [dbo].[MetricGroups].ID = [dbo].[MetricGroupMetric].GroupID";
            using (var command = new SqlCommand(sql, _connection))
            {
 
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var component = new Metric();
                        component.MetricId = reader.GetInt32(0);
                        component.Mnemonic = reader.GetString(1);
                        component.Description = reader.GetString(2);
                        component.DisplayName = reader.GetString(3);
                        component.Group = new MetricGroup
                        {
                            GroupId = reader.GetInt32(4),
                            GroupName = reader.GetString(5)
                        };
          
                        list.Add(component);
                    }
                }
            }
            _connection.Close();
            return list.OrderBy(x => x.Group.GroupId).AsEnumerable();
        }

        public Metric Get(int id)
        {
            const string sql = @"SELECT [dbo].[Metrics].*, [dbo].[MetricDescriptions].Description, [dbo].[MetricName].DisplayName, [dbo].[MetricGroups].*
	                        FROM [dbo].[Metrics] 
	                        JOIN [dbo].[MetricDescriptions]
		                        ON [dbo].[Metrics].ID = [dbo].[MetricDescriptions].MetricID
	                        JOIN [dbo].[MetricName]
		                        ON [dbo].[Metrics].ID = [dbo].[MetricName].MetricID
	                        LEFT JOIN [dbo].[MetricGroupMetric]
		                        ON  [dbo].[Metrics].ID = [dbo].[MetricGroupMetric].MetricID
	                        LEFT JOIN [dbo].[MetricGroups]	
		                        ON [dbo].[MetricGroups].ID = [dbo].[MetricGroupMetric].GroupID
	                        WHERE [dbo].[Metrics].ID = @MetricId ";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@MetricId", id);
                using (var reader = command.ExecuteReader())
                {
                    reader.Read();
                    var item = new Metric
                    {
                        MetricId = reader.GetInt32(0),
                        Mnemonic = reader.GetString(1),
                        Description = reader.GetString(2),
                        DisplayName = reader.GetString(3),
                        Group = new MetricGroup
                        {
                            GroupId = reader.GetInt32(4),
                            GroupName = reader.GetString(5)
                        }
                    };
                    _connection.Close();
                    return item;
                }
            }
        }

        public bool Exists(int id)
        {
            const string sql = @"SELECT COUNT(*) FROM [dbo].[Metrics] WHERE [ID] = @MetricId";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();

                command.Parameters.AddWithValue("@MetricId", id);
                int count = (int)command.ExecuteScalar();

                _connection.Close();
                return count > 0;
            }
        }
    }
}

