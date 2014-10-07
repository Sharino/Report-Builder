using System.Collections.Generic;
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
        private SqlConnection Connection;
        private IEnumerable<Metric> Reports { get; set; }

        public MetricRepository()
        {
            Connection = CreateDbConnection();
        }

        private static SqlConnection CreateDbConnection()
        {
            //TODO: add to config
            return new SqlConnection("data source = 172.22.3.236; initial catalog=ReportBuilder; user id = ReportBuilder; password = Katuciai13;");
        }

        public IEnumerable<Metric> GetAll()
        {
            string sql = @"SELECT * FROM [dbo].[Metrics]";
            using (var command = new SqlCommand(sql, Connection))
            {
                Connection.Open();
                using (var reader = command.ExecuteReader())
                {
                    var list = new List<Metric>();
                    while (reader.Read())
                    {
                        var component = new Metric();
                        component.MetricId = reader.GetInt32(0);
                        component.Mnemonic = reader.GetString(1);
                        component.Description = "";
                        component.Group = new MetricGroup();
                        component.DisplayName = "TESTINIS";
                        list.Add(component);
                    }
                    Connection.Close();
                    return list.AsEnumerable();
                }
            }
        }

        public Metric Get(int id)
        {
            //TODO command parameter
            string sql = @"SELECT * FROM [dbo].[Metrics] WHERE [ID] = @MetricId";
            using (var command = new SqlCommand(sql, Connection))
            {
                Connection.Open();
                command.Parameters.AddWithValue("@MetricId", id);
                using (var reader = command.ExecuteReader())
                {
                    reader.Read();
                    //TODO: refactor
                    var item = new Metric()
                    {
                        MetricId = reader.GetInt32(0), 
                        Mnemonic = reader.GetString(1),
                        DisplayName = "TESTINIS",
                        Description = "",
                        Group = new MetricGroup()
                    };
                    Connection.Close();
                    return item;
                }

            }
        }

        public bool Exists(int id)
        {
            string sql = @"SELECT COUNT(*) FROM [dbo].[Metrics] WHERE [ID] = @MetricId";
            using (var command = new SqlCommand(sql, Connection))
            {
                Connection.Open();

                command.Parameters.AddWithValue("@MetricId", id);
                int count = (int)command.ExecuteScalar();

                Connection.Close();
                if (count > 0)
                    return true;
                return false;
            }
        }
    }
}

