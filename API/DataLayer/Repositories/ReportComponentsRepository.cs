﻿using DataLayer.Repositories;
using Models.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;

namespace DataLayer.Base
{
    public class ComponentRepository : IBaseRepository
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
                        list.Add(component);
                    }
                    Connection.Close();
                    return list.AsEnumerable();
                }
            }
        }

        public ReportComponent Get(int id)
        {
            //TODO command parameter
            string sql = @"SELECT * FROM [dbo].[ReportComponents] WHERE [ReportId] = " + id;
            using (var command = new SqlCommand(sql, Connection))
            {
                Connection.Open();
                using (var reader = command.ExecuteReader())
                {
                    reader.Read();
                    //TODO: refactor
                    var item = new ReportComponent() { Id = reader.GetInt32(0), Title = reader.GetString(1) };
                    Connection.Close();
                    return item;
                }

            }
        }

        /// <param name="reportComponent"></param>
        /// <returns>Returns the ID of created entry</returns>
        public int Add(ReportComponent reportComponent)
        {
            string sql = @"INSERT INTO [dbo].[ReportComponents] (Title) VALUES ('" + reportComponent.Title + "'); SELECT @@IDENTITY;";
            using (var command = new SqlCommand(sql, Connection))
            {
                Connection.Open();
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
            string sql = @"DELETE FROM [dbo].[ReportComponents] WHERE [ReportId] = " + id;
            using (var command = new SqlCommand(sql, Connection))
            {
                Connection.Open();
                command.ExecuteNonQuery();
                Connection.Close();
            }
        }
    }
}