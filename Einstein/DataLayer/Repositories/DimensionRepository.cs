using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using Models.Models;
namespace DataLayer.Repositories
{
    public interface IDimensionsRepository
    {
        //string GetType(string mnemonic);
        bool Exists(string dimension);
    }
    public class DimensionRepository : IDimensionsRepository
    {
        private readonly SqlConnection _connection;
        public DimensionRepository()
        {
            _connection = CreateDbConnection();
        }
        private static SqlConnection CreateDbConnection()
        {
            var connectionString = ConfigurationManager.AppSettings["connectionString"];
            return new SqlConnection(connectionString);
        }

        public bool Exists(string mnemonic)
        {
            int count = 0;
            try
            {
                const string sql = @"SELECT COUNT(*) FROM [dbo].[Dimensions] WHERE [Mnemonic] = @DimensionMnemonic";
                using (var command = new SqlCommand(sql, _connection))
                {
                    _connection.Open();
                    command.Parameters.AddWithValue("@DimensionMnemonic", mnemonic);
                    object result = command.ExecuteScalar();
                    if (result != null)
                    {
                        count = Convert.ToInt32(result);
                    }
                    _connection.Close();
                }
            }
            catch (Exception exception)
            {
                const string filePath = @"..\EinsteinError.txt";

                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine("Message :" + exception.Message + "<br/>" + Environment.NewLine + "StackTrace :" + exception.StackTrace +
                       "" + Environment.NewLine + "Date :" + DateTime.Now.ToString());
                    writer.WriteLine(Environment.NewLine + "-----------------------------------------------------------------------------" + Environment.NewLine);
                }
            }
            return count > 0;
        }
    }
}

