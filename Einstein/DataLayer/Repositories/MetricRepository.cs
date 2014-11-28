using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using Models.Models;
namespace DataLayer.Repositories
{
    public interface IMetricsRepository
    {
        string GetType(string mnemonic);
        bool Exists(string mnemonic);
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
        public string GetType(string mnemonic)
        {
            const string sql = @"SELECT [dbo].[Metrics].*, [dbo].[MetricDescriptions].Description, [dbo].[MetricName].DisplayName, [dbo].[MetricGroups].*
                                FROM [dbo].[Metrics]
                                JOIN [dbo].[MetricDescriptions]
                                ON [dbo].[Metrics].ID = [dbo].[MetricDescriptions].MetricID
                                JOIN [dbo].[MetricName]
                                ON [dbo].[Metrics].ID = [dbo].[MetricName].MetricID
                                LEFT JOIN [dbo].[MetricGroupMetric]
                                ON [dbo].[Metrics].ID = [dbo].[MetricGroupMetric].MetricID
                                LEFT JOIN [dbo].[MetricGroups]
                                ON [dbo].[MetricGroups].ID = [dbo].[MetricGroupMetric].GroupID
                                WHERE [dbo].[Metrics].Mnemonic = @MetricMnemonic ";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                string datatype;
                command.Parameters.AddWithValue("@MetricMnemonic", mnemonic);
                using (var reader = command.ExecuteReader())
                {
                    reader.Read();
                    datatype = reader.GetString(2);
                };
                _connection.Close();
                return datatype;
            }
        }

        public bool Exists(string mnemonic)
        {
            const string sql = @"SELECT COUNT(*) FROM [dbo].[Metrics] WHERE [Mnemonic] = @MetricMnemonic";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@MetricMnemonic", mnemonic);
                object result = command.ExecuteScalar();
                int count = 0;
                if (result != null)
                {
                    count = Convert.ToInt32(result);
                }
                _connection.Close();
                return count > 0;
            }
        }
    }
}

