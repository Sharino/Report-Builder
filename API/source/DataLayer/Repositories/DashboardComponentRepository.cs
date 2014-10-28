using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
using Models.Models;

namespace DataLayer.Repositories
{
    public interface IDashboardComponentRepository
    {
        DashboardComponent Get(int id);
        int Add(DashboardComponent component);
        void Remove(int id);
        int Update(DashboardComponent component);
        bool DashboardExists(int id);
        bool ReportComponentExists(int id);
        bool Exists(int id);
        void UpdateDashboard(DashboardComponent component);
    }

    public class DashboardComponentRepository : IDashboardComponentRepository
    {
        private readonly JavaScriptSerializer _serializer;
        private readonly SqlConnection _connection;

        public DashboardComponentRepository()
        {
            _serializer = new JavaScriptSerializer();
            _connection = CreateDbConnection();
        }

        private static SqlConnection CreateDbConnection()
        {
            var connectionString = ConfigurationManager.AppSettings["connectionString"];
            return new SqlConnection(connectionString);
        }

        public DashboardComponent Get(int id)
        {
            const string sql = @"SELECT * FROM [dbo].[DashboardComponents] WHERE [Id] = @id";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@id", id);
                using (var reader = command.ExecuteReader())
                {
                    reader.Read();
                    var component = new DashboardComponent();

                    component.Id = reader.GetInt32(0);
                    component.DashboardId = reader.GetInt32(1);
                    component.Title = reader.GetString(2);
                    component.CreationDate = reader.GetString(3);
                    component.Type = reader.GetInt32(4);
                    component.Definition = reader.GetString(5);

                    _connection.Close();
                    return component;
                }
            }
        }

        public void UpdateDashboard(DashboardComponent component)
        {
            var componentDefinition = new List<int>();
            const string sql = @"SELECT Definition FROM [dbo].[Dashboard] WHERE [Id] = @dashboardId";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@dashboardId", component.DashboardId);
                using (var reader = command.ExecuteReader())
                {
                    reader.Read();
                    try
                    {
                        componentDefinition = _serializer.Deserialize<List<int>>(reader.GetString(0));
                    }
                    finally
                    {
                        if (componentDefinition == null)
                        {
                            componentDefinition = new List<int>();
                            
                        }
                    }
                    componentDefinition.Add(component.Id);
                    //componentDefinition.Add(component.Id);
                }
                _connection.Close();
            }

            const string update = @"UPDATE [dbo].[Dashboard] SET [Definition] = @definition WHERE [Id] = @id";
            using (var command = new SqlCommand(update, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@definition", _serializer.Serialize(componentDefinition));
                command.Parameters.AddWithValue("@id", component.DashboardId);
                command.ExecuteNonQuery();
                _connection.Close();
            }
        }

        public int Add(DashboardComponent component)
        {
            const string sql = @"INSERT INTO [dbo].[DashboardComponents] (DashboardId, Title, CreationDate, Type, Definition) VALUES (@dashboardId, @title, @creationDate, @type, @definition); SELECT @@IDENTITY;";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@dashboardId", component.DashboardId);
                command.Parameters.AddWithValue("@title", component.Title);
                command.Parameters.AddWithValue("@creationDate", component.CreationDate);
                command.Parameters.AddWithValue("@type", component.Type);
                command.Parameters.AddWithValue("@definition", component.Definition);
                int id = 0;
                object result = command.ExecuteScalar();
                _connection.Close();

                if (result != null)
                {
                    id = Convert.ToInt32(result);
                }
                component.Id = id;
                return id;
            }
        }

        public int Update(DashboardComponent component)
        {
            const string sql = @"UPDATE [dbo].[DashboardComponents] SET [DashboardId] = @dashboardId, [Title] = @title, [CreationDate] = @creationDate, [Type] = @type, [Definition] = @definition WHERE [Id] = @id";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@dashboardId", component.DashboardId);
                command.Parameters.AddWithValue("@title", component.Title);
                command.Parameters.AddWithValue("@creationDate", component.CreationDate);
                command.Parameters.AddWithValue("@type", component.Type);
                command.Parameters.AddWithValue("@definition", component.Definition);
                command.Parameters.AddWithValue("@id", component.Id);

                command.ExecuteNonQuery();
                _connection.Close();
                return component.Id;
            }
        }


        public void Remove(int id)
        {
            const string sql = @"DELETE FROM [dbo].[DashboardComponents] WHERE [Id] = @id";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@id", id);
                command.ExecuteNonQuery();
                _connection.Close();
            }
        }

        public bool DashboardExists(int id)
        {
            const string sql = @"SELECT COUNT(*) FROM [dbo].[Dashboard] WHERE [Id] = @id";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();

                command.Parameters.AddWithValue("@id", id);
                int count = (int)command.ExecuteScalar();

                _connection.Close();
                return count > 0;
            }
        }

        public bool ReportComponentExists(int id)
        {
            const string sql = @"SELECT COUNT(*) FROM [dbo].[ReportComponents] WHERE [ReportId] = @id";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();

                command.Parameters.AddWithValue("@id", id);
                int count = (int)command.ExecuteScalar();

                _connection.Close();
                return count > 0;
            }
        }

        public bool Exists(int id)
        {
            const string sql = @"SELECT COUNT(*) FROM [dbo].[DashboardComponents] WHERE [Id] = @id";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();

                command.Parameters.AddWithValue("@id", id);
                int count = (int)command.ExecuteScalar();

                _connection.Close();
                return count > 0;
            }
        }
    }
}
