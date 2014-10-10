using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Script.Serialization;
using Models.Models;

namespace DataLayer.Repositories
{
    public interface IComponentRepository : IBaseRepository
    {

    }

    public class ComponentRepository : IComponentRepository
    {
        private readonly SqlConnection _connection;
        private readonly JavaScriptSerializer _jsonSerialiser;

        public ComponentRepository()
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
            const string sql = @"SELECT * FROM [dbo].[ReportComponents]";
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
                        var data = json.Deserialize<ReportComponentData>(reader.GetString(3));
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
            const string sql = @"SELECT * FROM [dbo].[ReportComponents] WHERE [ReportId] = @reportId";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@reportId", id);
                using (var reader = command.ExecuteReader())
                {
                    reader.Read();
                    var component = new ReportComponent();
                    component.Id = reader.GetInt32(0);
                    component.Title = reader.GetString(1);
                    component.Type = reader.GetInt32(2);

                    var json = new JavaScriptSerializer();
                    var data = json.Deserialize<ReportComponentData>(reader.GetString(3));
                    component.Data = data;

                    _connection.Close();
                    return component;
                }

            }
        }

        public int Add(ReportComponent reportComponent)
        {
            const string sql = @"INSERT INTO [dbo].[ReportComponents] (Title, Type, Data) VALUES (@reportTitle, @reportType, @data); SELECT @@IDENTITY;";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@reportTitle", reportComponent.Title);
                command.Parameters.AddWithValue("@reportType", reportComponent.Type);
                command.Parameters.AddWithValue("@data", _jsonSerialiser.Serialize(reportComponent.Data));
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
            const string sql = @"UPDATE [dbo].[ReportComponents] SET [Title] = @reportTitle, [Type] = @reportType, [Data] = @data WHERE [ReportId] = @reportId";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@reportTitle", reportComponent.Title);
                command.Parameters.AddWithValue("@reportType", reportComponent.Type);
                command.Parameters.AddWithValue("@data", _jsonSerialiser.Serialize(reportComponent.Data));
                command.Parameters.AddWithValue("@reportId", reportComponent.Id);
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
            const string sql = @"DELETE FROM [dbo].[ReportComponents] WHERE [ReportId] = @reportId";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();
                command.Parameters.AddWithValue("@reportId", id);
                command.ExecuteNonQuery();
                _connection.Close();
            }
        }

        public bool Exists(int id)
        {
            const string sql = @"SELECT COUNT(*) FROM [dbo].[ReportComponents] WHERE [ReportId] = @reportId";
            using (var command = new SqlCommand(sql, _connection))
            {
                _connection.Open();

                command.Parameters.AddWithValue("@reportId", id);
                int count = (int)command.ExecuteScalar();

                _connection.Close();
                return count > 0;
            }
        }
    }
}