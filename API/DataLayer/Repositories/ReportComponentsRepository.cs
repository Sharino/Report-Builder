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
        private SqlConnection Connection;
        private IEnumerable<ReportComponent> Reports { get; set; }

        public ComponentRepository()
        {
            Connection = CreateDbConnection();
        }

        private static SqlConnection CreateDbConnection()
        {
            //TODO: add to config
            return new SqlConnection("data source = 172.22.3.236; initial catalog=ReportBuilder; user id = ReportBuilder; password = Katuciai13;");
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

        /// <param name="reportComponent"></param>
        /// <returns>Returns the ID of created entry</returns>
        public int Add(ReportComponent reportComponent)
        {
            string sql = @"INSERT INTO [dbo].[ReportComponents] (Title) VALUES (@reportTitle); SELECT @@IDENTITY;";
            using (var command = new SqlCommand(sql, Connection))
            {
                Connection.Open();
                command.Parameters.AddWithValue("@reportTitle", reportComponent.Title);
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

        public int Update(ReportComponent report)
        {
            string sql = @"UPDATE [dbo].[ReportComponents] SET [Title] = @reportTitle WHERE [ReportId] = @reportId";
            using (var command = new SqlCommand(sql, Connection))
            {
                Connection.Open();
                command.Parameters.AddWithValue("@reportTitle", report.Title);
                command.Parameters.AddWithValue("@reportId", report.Id);
                int id = 0;
                object result = command.ExecuteScalar();
                if (result != null)
                {
                    id = Convert.ToInt32(result);
                }
                Connection.Close();
                return 0;
            }
        }
    }
}