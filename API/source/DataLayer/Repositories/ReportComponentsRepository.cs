using System.Configuration;
using DataLayer.Repositories;
using Models.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Script.Serialization;

namespace DataLayer.Base
{
    public interface IComponentRepository : IBaseRepository
    {

    }

    public class ComponentRepository : IComponentRepository
    {
        private readonly SqlConnection Connection;
        private readonly JavaScriptSerializer jsonSerialiser;

        public ComponentRepository()
        {
            jsonSerialiser = new JavaScriptSerializer();
            Connection = CreateDbConnection();
        }

        private static SqlConnection CreateDbConnection()
        {
            var connectionString = ConfigurationManager.AppSettings["connectionString"];
            return new SqlConnection(connectionString);
        }

        public IEnumerable<ReportComponent> GetAll()
        {
            string sql = @"SELECT * FROM [dbo].[ReportComponents]";
            using (var command = new SqlCommand(sql, Connection))
            {
                Connection.Open();
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
                    Connection.Close();
                    return list.AsEnumerable();
                }
            }
        }

        public ReportComponent Get(int id)
        {
            string sql = @"SELECT * FROM [dbo].[ReportComponents] WHERE [ReportId] = @reportId";
            using (var command = new SqlCommand(sql, Connection))
            {
                Connection.Open();
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

                    Connection.Close();
                    return component;
                }

            }
        }

        public int Add(ReportComponent reportComponent)
        {
            string sql = @"INSERT INTO [dbo].[ReportComponents] (Title, Type, Data) VALUES (@reportTitle, @reportType, @data); SELECT @@IDENTITY;";
            using (var command = new SqlCommand(sql, Connection))
            {
                Connection.Open();
                command.Parameters.AddWithValue("@reportTitle", reportComponent.Title);
                command.Parameters.AddWithValue("@reportType", reportComponent.Type);
                command.Parameters.AddWithValue("@data", jsonSerialiser.Serialize(reportComponent.Data));
                int id = 0;
                object result = command.ExecuteScalar();

                if (result != null)
                {
                    id = Convert.ToInt32(result);
                }

                Connection.Close();

                return id;
            }
        }

        public int Update(ReportComponent reportComponent)
        {
            string sql = @"UPDATE [dbo].[ReportComponents] SET [Title] = @reportTitle, [Type] = @reportType, [Data] = @data WHERE [ReportId] = @reportId";
            using (var command = new SqlCommand(sql, Connection))
            {
                Connection.Open();
                command.Parameters.AddWithValue("@reportTitle", reportComponent.Title);
                command.Parameters.AddWithValue("@reportType", reportComponent.Type);
                command.Parameters.AddWithValue("@data", jsonSerialiser.Serialize(reportComponent.Data));
                command.Parameters.AddWithValue("@reportId", reportComponent.Id);
                int id = 0;
                object result = command.ExecuteScalar();
                if (result != null)
                {
                    id = Convert.ToInt32(result);
                }
                Connection.Close();
                return id;
            }
        }

        public void Remove(int id)
        {
            string sql = @"DELETE FROM [dbo].[ReportComponents] WHERE [ReportId] = @reportId";
            using (var command = new SqlCommand(sql, Connection))
            {
                Connection.Open();
                command.Parameters.AddWithValue("@reportId", id);
                command.ExecuteNonQuery();
                Connection.Close();
            }
        }

        public bool Exists(int id)
        {
            string sql = @"SELECT COUNT(*) FROM [dbo].[ReportComponents] WHERE [ReportId] = @reportId";
            using (var command = new SqlCommand(sql, Connection))
            {
                Connection.Open();

                command.Parameters.AddWithValue("@reportId", id);
                int count = (int)command.ExecuteScalar();

                Connection.Close();
                if (count > 0)
                    return true;
                return false;
            }
        }
    }
}