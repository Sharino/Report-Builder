using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Script.Serialization;
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
            const string sql = @"SELECT * FROM [dbo].[Dashboards] WHERE [IsDeleted] = 0";
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
                        item.ComponentIds = _serializer.Deserialize<List<int>>(reader.GetString(2));
                        item.CreationDate = reader.GetString(3);
                        item.ModificationDate = reader.GetString(4);
                        list.Add(item);
                    }
                    _connection.Close();
                    return list.AsEnumerable();
                }
            }
        }

        public Dashboard Get(int id)
        {
            const string sql = @"SELECT * FROM [dbo].[Dashboards] WHERE [Id] = @id";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@id", id);
                using (var reader = command.ExecuteReader())
                {
                    reader.Read();
                    var item = new Dashboard();
                    item.Id = reader.GetInt32(0);
                    item.Title = reader.GetString(1);
                    item.ComponentIds = _serializer.Deserialize<List<int>>(reader.GetString(2));
                    item.CreationDate = reader.GetString(3);
                    item.ModificationDate = reader.GetString(4);
                    _connection.Close();
                    return item;
                }
            }
        }

        public int Add(Dashboard dashboard)  
        {
            const string sql = @"INSERT INTO [dbo].[Dashboards] (Title, Definition, CreationDate, ModificationDate) VALUES (@title, @definition, @creationDate, @modificationDate); SELECT @@IDENTITY;";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@title", dashboard.Title);
                command.Parameters.AddWithValue("@definition", _serializer.Serialize(dashboard.ComponentIds));
                command.Parameters.AddWithValue("@creationDate", DateTime.UtcNow.ToString("yyyy-MM-dd hh:mm:ss"));
                command.Parameters.AddWithValue("@modificationDate", DateTime.UtcNow.ToString("yyyy-MM-dd hh:mm:ss"));
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
            const string sql = @"UPDATE [dbo].[Dashboards] SET [IsDeleted] = @q, [DeletionDate] = @deletionDate WHERE [Id] = @id";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@id", id);
                command.Parameters.AddWithValue("@q", 1);
                command.Parameters.AddWithValue("@deletionDate", DateTime.UtcNow.ToString("yyyy-MM-dd hh:mm:ss"));
                command.ExecuteNonQuery();
                _connection.Close();
            }
        }

        public int Update(Dashboard dashboard)
        {
            const string sql = @"UPDATE [dbo].[Dashboards] SET [Title] = @title, [Definition] = @definition, [ModificationDate] = @modificationDate WHERE [Id] = @id";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@title", dashboard.Title);
                command.Parameters.AddWithValue("@definition", _serializer.Serialize(dashboard.ComponentIds));
                command.Parameters.AddWithValue("@id", dashboard.Id);
                command.Parameters.AddWithValue("@modificationDate", DateTime.UtcNow.ToString("yyyy-MM-dd hh:mm:ss"));
                command.ExecuteNonQuery();
                _connection.Close();
                return dashboard.Id;
            }
        }

        public bool Exists(int id)
        {
            const string sql = @"SELECT COUNT(*) FROM [dbo].[Dashboards] WHERE [Id] = @id AND [IsDeleted] = 0";
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
