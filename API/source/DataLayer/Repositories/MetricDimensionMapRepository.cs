using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using Models.Models;
using System.Collections.Generic;

namespace DataLayer.Repositories
{
    public interface IMetricDimensionMapRepository
    {
        List<int> GetMetricDimensions(int id);
        List<int> GetDimensionMetrics(int id);
        int GetMetricCount();
        int GetDimensionCount();


    }
    public class MetricDimensionMapRepository: IMetricDimensionMapRepository
    {
        private readonly SqlConnection _connection;
        public MetricDimensionMapRepository()
        {
            _connection = CreateDbConnection();
        }

        private static SqlConnection CreateDbConnection()
        {
            var connectionString = ConfigurationManager.AppSettings["connectionString"];
            return new SqlConnection(connectionString);
        }

        public List<int> GetMetricDimensions(int id)
        {
            const string sql = @"SELECT [DimensionId] FROM [ReportBuilder].[dbo].[MetricDimensionMetric] WHERE MetricId = @id";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@id", id);
                using (var reader = command.ExecuteReader())
                {
                    var dimensionIds = new List<int>();
                    while (reader.Read())
                    {
                        dimensionIds.Add(reader.GetInt32(0));
                    }
                    _connection.Close();
                    return dimensionIds;
                }
            }
        }

        public List<int> GetDimensionMetrics(int id)
        {
            const string sql = @"SELECT [MetricId] FROM [ReportBuilder].[dbo].[MetricDimensionMetric] WHERE DimensionId = @id";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@id", id);
                using (var reader = command.ExecuteReader())
                {
                    var metricIds = new List<int>();
                    while (reader.Read())
                    {
                        metricIds.Add(reader.GetInt32(0));
                    }
                    _connection.Close();
                    return metricIds;
                }
            }
        }
        public int GetMetricCount()
        {
            const string sql = @"SELECT TOP 1 [ID] FROM [ReportBuilder].[dbo].[Metrics] ORDER BY ID DESC;";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                int count = (int)command.ExecuteScalar();
                _connection.Close();
                return count;
            }
        }

        public int GetDimensionCount()
        {
            const string sql = @"SELECT TOP 1 [ID] FROM [ReportBuilder].[dbo].[Dimensions] ORDER BY ID DESC;";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                int count = (int)command.ExecuteScalar();
                _connection.Close();
                return count;
            }
        }
    }
}
