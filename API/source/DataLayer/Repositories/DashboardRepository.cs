using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
using System.Web.UI.WebControls;
using Models.Models;

namespace DataLayer.Repositories
{
    public interface IDashboardRepository
    {
        IEnumerable<Dashboard> GetAll();
        Dashboard Get(int id);
        int Add(Dashboard dashboard);
        void Remove(int id);
        int Update(Dashboard dashboard);
        bool Exists(int id);
    }

    public class DashboardRepository : IDashboardRepository
    {
        private readonly JavaScriptSerializer _serializer;
        private readonly SqlConnection _connection;

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
            const string sql = @"SELECT * FROM [dbo].[Dashboard]";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                using (var reader = command.ExecuteReader())
                {
                    var list = new List<Dashboard>();
                    while (reader.Read())
                    {
                        var item = new Dashboard();
                        item.Id = reader.GetInt32(0);
                        item.Title = reader.GetString(1);
                        item.Components = _serializer.Deserialize<List<int>>(reader.GetString(2));
                        list.Add(item);
                    }
                    _connection.Close();
                    return list;
                }
            }
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
                    dashboard.Components = _serializer.Deserialize<List<int>>(reader.GetString(2));

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
                command.Parameters.AddWithValue("@definition", _serializer.Serialize(dashboard.Components));
                object result = command.ExecuteScalar();
                int id = 0;
                if (result != null)
                {
                    id = Convert.ToInt32(result);
                }
                _connection.Close();
                return id;
            }
        }

        public void Remove(int id)
        {
            const string sql = @"DELETE FROM [dbo].[Dashboard] WHERE [Id] = @id";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@id", id);
                command.ExecuteNonQuery();
                _connection.Close();
            }
        }

        public int Update(Dashboard dashboard)
        {
            const string sql = @"UPDATE [dbo].[Dashboard] SET [Title] = @title, [Definition] = @definition WHERE [Id] = @id";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@title", dashboard.Title);
                command.Parameters.AddWithValue("@definition", _serializer.Serialize(dashboard.Components));
                command.Parameters.AddWithValue("@id", dashboard.Id);
                command.ExecuteNonQuery();
                _connection.Close();
                return dashboard.Id;
            }
        }

        public bool Exists(int id)
        {
            const string sql = @"SELECT COUNT(*) FROM [dbo].[Dashboard] WHERE [Id] = @id";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@id", id);
                int count = (int) command.ExecuteScalar();
                _connection.Close();
                return count > 0;
            }
        }
    }
}
