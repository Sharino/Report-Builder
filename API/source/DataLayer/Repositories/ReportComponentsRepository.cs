using System.Configuration;
using DataLayer.Repositories;
using Models.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;

namespace DataLayer.Base
{
    public interface IComponentRepository: IBaseRepository
    {
    
    }

    public class ComponentRepository : IComponentRepository
    {
        private readonly SqlConnection Connection;

        public ComponentRepository()
        {
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
                    var item = new ReportComponent();
                    item.Id = reader.GetInt32(0);
                    item.Title = reader.GetString(1);
                    item.Type = reader.GetInt32(2);
                    Connection.Close();
                    return item;
                }

            }
        }

        public int Add(ReportComponent reportComponent)
        {
            string sql = @"INSERT INTO [dbo].[ReportComponents] (Title, Type) VALUES (@reportTitle, @reportType); SELECT @@IDENTITY;";
            using (var command = new SqlCommand(sql, Connection))
            {
                Connection.Open();
                command.Parameters.AddWithValue("@reportTitle", reportComponent.Title);
                command.Parameters.AddWithValue("@reportType", reportComponent.Type);
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
            string sql = @"UPDATE [dbo].[ReportComponents] SET [Title] = @reportTitle, [Type] = @reportType WHERE [ReportId] = @reportId";
            using (var command = new SqlCommand(sql, Connection))
            {
                Connection.Open();
                command.Parameters.AddWithValue("@reportTitle", reportComponent.Title);
                command.Parameters.AddWithValue("@reportType", reportComponent.Type);
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
                int count = (int) command.ExecuteScalar();

                Connection.Close();
                if (count > 0)
                    return true;
                return false;
            }
        }
    }
}