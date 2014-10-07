﻿using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using Models.Models;

namespace DataLayer.Repositories
{
    public interface IMetricsRepository
    {
        IEnumerable<Metric> GetAll();
        Metric Get(int id);
        bool Exists(int id);
    }
    public class MetricRepository : IMetricsRepository
    {
        private SqlConnection Connection;
        private IEnumerable<Metric> Reports { get; set; }

        public MetricRepository()
        {
            Connection = CreateDbConnection();
        }

        private static SqlConnection CreateDbConnection()
        {
            //TODO: add to config
            return new SqlConnection("data source = 172.22.3.236; initial catalog=ReportBuilder; user id = ReportBuilder; password = Katuciai13;");
        }

        public IEnumerable<Metric> GetAll()
        {
            var list = new List<Metric>();
            Connection.Open();
            string sql = @" SELECT [dbo].[Metrics].*, [dbo].[MetricDescriptions].Description, [dbo].[MetricName].DisplayName, [dbo].[MetricGroups].*
	                        FROM [dbo].[Metrics] 
	                        JOIN [dbo].[MetricDescriptions]
		                        ON [dbo].[Metrics].ID = [dbo].[MetricDescriptions].MetricID
	                        JOIN [dbo].[MetricName]
		                        ON [dbo].[Metrics].ID = [dbo].[MetricName].NameID
	                        LEFT JOIN [dbo].[MetricGroupMap]
		                        ON  [dbo].[Metrics].ID = [dbo].[MetricGroupMap].MetricID
	                        LEFT JOIN [dbo].[MetricGroups]	
		                        ON [dbo].[MetricGroups].ID = [dbo].[MetricGroupMap].GroupID";
            using (var command = new SqlCommand(sql, Connection))
            {
 
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var component = new Metric();
                        component.MetricId = reader.GetInt32(0);
                        component.Mnemonic = reader.GetString(1);
                        component.Description = reader.GetString(2);
                        component.DisplayName = reader.GetString(3);
                        component.Group = new MetricGroup()
                        {
                            GroupId = reader.GetInt32(4),
                            GroupName = reader.GetString(5)
                        };
          
                        list.Add(component);
                    }
           
  
                }
            }
            Connection.Close();
            return list.AsEnumerable();
        }

        public Metric Get(int id)
        {
            //TODO command parameter
            string sql = @"SELECT [dbo].[Metrics].*, [dbo].[MetricDescriptions].Description, [dbo].[MetricName].DisplayName, [dbo].[MetricGroups].*
	                        FROM [dbo].[Metrics] 
	                        JOIN [dbo].[MetricDescriptions]
		                        ON [dbo].[Metrics].ID = [dbo].[MetricDescriptions].MetricID
	                        JOIN [dbo].[MetricName]
		                        ON [dbo].[Metrics].ID = [dbo].[MetricName].NameID
	                        LEFT JOIN [dbo].[MetricGroupMap]
		                        ON  [dbo].[Metrics].ID = [dbo].[MetricGroupMap].MetricID
	                        LEFT JOIN [dbo].[MetricGroups]	
		                        ON [dbo].[MetricGroups].ID = [dbo].[MetricGroupMap].GroupID
	                        WHERE [dbo].[Metrics].ID = @MetricId ";
            using (var command = new SqlCommand(sql, Connection))
            {
                Connection.Open();
                command.Parameters.AddWithValue("@MetricId", id);
                using (var reader = command.ExecuteReader())
                {
                    reader.Read();
                    //TODO: refactor
                    var item = new Metric()
                    {
                        MetricId = reader.GetInt32(0),
                        Mnemonic = reader.GetString(1),
                        Description = reader.GetString(2),
                        DisplayName = reader.GetString(3),
                        Group = new MetricGroup()
                        {
                            GroupId = reader.GetInt32(4),
                            GroupName = reader.GetString(5)
                        }
                    };
                    Connection.Close();
                    return item;
                }

            }
        }

        public bool Exists(int id)
        {
            string sql = @"SELECT COUNT(*) FROM [dbo].[Metrics] WHERE [ID] = @MetricId";
            using (var command = new SqlCommand(sql, Connection))
            {
                Connection.Open();

                command.Parameters.AddWithValue("@MetricId", id);
                int count = (int)command.ExecuteScalar();

                Connection.Close();
                if (count > 0)
                    return true;
                return false;
            }
        }
    }
}

