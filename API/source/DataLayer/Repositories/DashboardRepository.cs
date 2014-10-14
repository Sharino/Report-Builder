using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
using Models.Models;
using Newtonsoft.Json;

namespace DataLayer.Repositories
{
    public interface IDashboardRepository
    {
        IEnumerable<Dashboard> GetAll();
        Dashboard Get(int id);
        int Add(Dashboard report);
        void Remove(int id);
        int Update(Dashboard report);
        bool Exists(int id);
    }

    public class DashboardRepository : IDashboardRepository
    {

        private readonly SqlConnection _connection;
        private readonly JavaScriptSerializer _serializer;

        public DashboardRepository()
        {
            _serializer = new JavaScriptSerializer();
            _connection = CreateDbConnection();
        }

        private static SqlConnection CreateDbConnection()
        {
            var connectionString = ConfigurationManager.AppSettings["connectionString"];
            return new SqlConnection(connectionString);
        }


        public IEnumerable<Dashboard> GetAll()
        {
            const string sql = "";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        
                    }
                }
            }
            _connection.Close();
            return null;
        }

        public Dashboard Get(int id)
        {
            const string sql = @"SELECT * FROM [dbo].[Dashboard] WHERE [Id] = @id";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@id", id);
                using (var reader = command.ExecuteReader())
                {
                    reader.Read();
                    var dashboard = new Dashboard();
                    dashboard.Id = reader.GetInt32(0);
                    dashboard.Title = reader.GetString(1);
                    var components = _serializer.Deserialize<List<ReportComponent>>(reader.GetString(2));
                    dashboard.ReportComponents = components;

                    _connection.Close();
                    return dashboard;
                }
            }
        }

        public int Add(Dashboard dashboard)
        {
            const string sql = @"INSERT INTO [dbo].[Dashboard] (Title, Definition) VALUES (@title, @definition); SELECT @@IDENTITY;";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@title", dashboard.Title);
                command.Parameters.AddWithValue("@definition", _serializer.Serialize(dashboard.ReportComponents));
                object result = command.ExecuteScalar();
                int id = 0;
                if (result != null)
                {
                    id = (int) result;
                }
                _connection.Close();
                return id;
            }
        }

        public void Remove(int id)
        {
            const string sql = "";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {

                    }
                }
            }
            _connection.Close();
        }

        public int Update(Dashboard report)
        {
            const string sql = "";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {

                    }
                }
            }
            _connection.Close();
            return 0;
        }

        public bool Exists(int id)
        {
            const string sql = "";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {

                    }
                }
            }
            _connection.Close();
            return false;
        }
    }
}
