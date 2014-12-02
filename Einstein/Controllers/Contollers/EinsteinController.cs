using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Runtime.InteropServices;
using System.Web.Http;
using System.Web.Http.Cors;
using Contracts.DTO;
using DataLayer.Repositories;
using log4net;
using Models.Models;

namespace Controllers.Contollers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class EinsteinController : ApiController
    {
        private static class MetricDataTypes
        {
            public const string Percent = "percent";
            public const string Float = "float";
            public const string Integer = "int";
        }

        private MetricRepository _metricRepository;// = new MetricRepository();
        private DimensionRepository _dimensionRepository;// = new DimensionRepository();
        private string[] _lines;// = File.ReadAllLines("RandomWords.txt");

        [HttpPost]
        public HttpResponseMessage Data([FromBody]Request input)
        {
            _lines = File.ReadAllLines("RandomWords.txt");
            _dimensionRepository = new DimensionRepository();
            _metricRepository = new MetricRepository();

            try
            {
                var response = new EinsteinDTO
                {
                    ComponentValues = new List<IDimensionMetricPair>()
                };

                var fromDate = input.Filters.DateFilter.From;
                var endDate = input.Dimensions.Count == 0 ? input.Filters.DateFilter.From : input.Filters.DateFilter.To;

                IEnumerable<DateTime> iterator = null;
                var dateMnemonic = "d_Date";
                foreach (var dimension in input.Dimensions)
                {
                    if (_dimensionRepository.Exists(dimension))
                    {
                        switch (dimension)
                        {
                            case "d_Day":
                                iterator = EachDay(fromDate, endDate);
                                dateMnemonic = "d_Date";
                                break;
                            case "d_Month":
                                iterator = EachMonth(fromDate, endDate);
                                dateMnemonic = "d_Month";
                                break;
                            case "d_Year":
                                iterator = EachYear(fromDate, endDate);
                                dateMnemonic = "d_Year";
                                break;
                        }

                        if (iterator != null)
                        {
                            foreach (DateTime day in iterator)
                            {
                                response.ComponentValues.Add(SetData(input, dateMnemonic, day.ToShortDateString()));
                            }

                            break;
                        }
                    }
                }

                if (iterator == null)
                {
                    if (input.Dimensions.Count == 0)
                    {
                        response.ComponentValues.Add(SetData(input, "d_Date", GetRandomWord()));
                    }
                    else
                    {
                        var rand = (new Random().Next(25)) + 1;
                        for (int i = 0; i < rand; i++)
                        {
                            response.ComponentValues.Add(SetData(input, input.Dimensions[0], GetRandomWord()));
                        }
                    }
                }

                var ret = Request.CreateResponse(HttpStatusCode.OK, response);
                //       ret.Headers.Add("Access-Control-Allow-Origin", "*");
                return ret;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
            return null;
        }

        private string GetRandomWord()
        {
            var r = new Random();
            var randomLineNumber = r.Next(0, _lines.Length - 1);
            var line = _lines[randomLineNumber];

            return line;
        }

        private DimensionMetricPair SetData(Request input, string dimensionMnemonic, string dimensionValue)
        {   
            var dimensionList = new DimensionValuesList();
            var metricList = new MetricValuesList();

            dimensionList.Add(new DimensionValues
            {
                Key = dimensionMnemonic,
                Value = dimensionValue
            });

            foreach (var metric in input.Metrics)
            {
                if (_metricRepository.Exists(metric))
                {
                    var comp = new MetricValues
                    {
                        Key = metric,
                        Value = GenerateData(_metricRepository.GetType(metric))
                    };

                    metricList.Add(comp);
                }
            }

            return new DimensionMetricPair
            {
                DimensionValues = dimensionList,
                MetricValues = metricList
            };
        }

        private static string GenerateData(string type)
        {
            string randomData;
            switch (type)
            {
                case MetricDataTypes.Float:
                    double d = (new Random().NextDouble()*100000);
                    d = Math.Round(d, 2);
                    randomData = d.ToString(CultureInfo.CurrentUICulture);
                    break;
                case MetricDataTypes.Integer:
                    var rand = new Random().Next(10000);
                    randomData = rand.ToString(CultureInfo.InvariantCulture);
                    break;
                case MetricDataTypes.Percent:
                    double random = new Random().Next(100);
                    random = Math.Round(random, 2);
                    randomData = random.ToString(CultureInfo.InvariantCulture);
                    break;
                default:
                    randomData = "Unsupported data type";
                    break;
            }

            return randomData;
        }

        public static IEnumerable<DateTime> EachDay(DateTime from, DateTime thru)
        {
            for (var day = from.Date; day.Date <= thru.Date; day = day.AddDays(1))
                yield return day;
        }

        public static IEnumerable<DateTime> EachMonth(DateTime from, DateTime thru)
        {
            for (var month = from.Date; month.Date <= thru.Date || month.Month == thru.Month; month = month.AddMonths(1))
                yield return month;
        }

        public static IEnumerable<DateTime> EachYear(DateTime from, DateTime thru)
        {
            for (var year = from.Date; year.Date <= thru.Date || year.Year == thru.Year; year = year.AddYears(1))
                yield return year;
        }

    }
}