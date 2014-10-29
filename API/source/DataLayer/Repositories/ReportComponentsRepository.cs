using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Script.Serialization;
using Models.Models;

namespace DataLayer.Repositories
{
    public interface IReportComponentRepository
    {
        IEnumerable<ReportComponent> GetAll();
        ReportComponent Get(int id);
        int Add(ReportComponent report);
        void Remove(int id);
        int Update(ReportComponent report);
        bool Exists(int id);
    }

    public class ReportComponentRepository : IReportComponentRepository
    {
        private readonly SqlConnection _connection;
        private readonly JavaScriptSerializer _jsonSerialiser;

        public ReportComponentRepository()
        {
            _jsonSerialiser = new JavaScriptSerializer();
            _connection = CreateDbConnection();
        }

        private static SqlConnection CreateDbConnection()
        {
            var connectionString = ConfigurationManager.AppSettings["connectionString"];
            return new SqlConnection(connectionString);
        }

        public IEnumerable<ReportComponent> GetAll()
        {
            const string sql = @"SELECT * FROM [dbo].[ReportComponents] WHERE [IS_DELETED] = 0";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                using (var reader = command.ExecuteReader())
                {
                    var list = new List<ReportComponent>();
                    while (reader.Read())
                    {
                        var component = new ReportComponent();
                        component.Id = reader.GetInt32(0);
                        component.Title = reader.GetString(1);
                        component.Type = reader.GetInt32(2);

                        var json = new JavaScriptSerializer();
                        var data = json.Deserialize<ComponentData>(reader.GetString(3));
                        component.Data = data;
                        list.Add(component);
                    }
                    _connection.Close();
                    return list.AsEnumerable();
                }
            }
        }

        public ReportComponent Get(int id)
        {
            const string sql = @"SELECT * FROM [dbo].[ReportComponents] WHERE [Id] = @Id";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@Id", id);
                using (var reader = command.ExecuteReader())
                {
                    reader.Read();
                    var component = new ReportComponent();
                    component.Id = reader.GetInt32(0);
                    component.Title = reader.GetString(1);
                    component.Type = reader.GetInt32(2);

                    var json = new JavaScriptSerializer();
                    var data = json.Deserialize<ComponentData>(reader.GetString(3));
                    component.Data = data;

                    _connection.Close();
                    return component;
                }

            }
        }

        public int Add(ReportComponent reportComponent)
        {
            const string sql = @"INSERT INTO [dbo].[ReportComponents] (Title, Type, Definition, CreationDate, ModificationDate) VALUES (@componentTitle, @componentType, @definition, @creationDate, @modificationDate); SELECT @@IDENTITY;";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@componentTitle", reportComponent.Title);
                command.Parameters.AddWithValue("@componentType", reportComponent.Type);
                command.Parameters.AddWithValue("@definition", _jsonSerialiser.Serialize(reportComponent.Data));
                command.Parameters.AddWithValue("@creationDate", DateTime.UtcNow.ToString("yyyy-MM-dd hh:mm:ss"));
                command.Parameters.AddWithValue("@modificationDate", DateTime.UtcNow.ToString("yyyy-MM-dd hh:mm:ss"));
                int id = 0;
                object result = command.ExecuteScalar();

                if (result != null)
                {
                    id = Convert.ToInt32(result);
                }

                _connection.Close();

                return id;
            }
        }

        public int Update(ReportComponent reportComponent)
        {
            const string sql = @"UPDATE [dbo].[ReportComponents] SET [Title] = @reportTitle, [Type] = @reportType, [Definition] = @definition, [ModificationDate] = @modificationDate WHERE [Id] = @Id";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@reportTitle", reportComponent.Title);
                command.Parameters.AddWithValue("@reportType", reportComponent.Type);
                command.Parameters.AddWithValue("@definition", _jsonSerialiser.Serialize(reportComponent.Data));
                command.Parameters.AddWithValue("@Id", reportComponent.Id);
                command.Parameters.AddWithValue("@modificationDate", DateTime.UtcNow.ToString("yyyy-MM-dd hh:mm:ss"));
                int id = 0;
                object result = command.ExecuteScalar();
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
            const string sql = @"UPDATE [dbo].[ReportComponents] SET [IS_DELETED] = 1, [DeletionDate] = @deletionDate WHERE [Id] = @Id";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@Id", id);
                command.Parameters.AddWithValue("@deletionDate", DateTime.UtcNow.ToString("yyyy-MM-dd hh:mm:ss"));
                command.ExecuteNonQuery();
                _connection.Close();
            }
        }

        public bool Exists(int id)
        {
            const string sql = @"SELECT COUNT(*) FROM [dbo].[ReportComponents] WHERE [Id] = @Id AND [IS_DELETED] = 0";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();

                command.Parameters.AddWithValue("@Id", id);
                int count = (int)command.ExecuteScalar();

                _connection.Close();
                return count > 0;
            }
        }
    }
}