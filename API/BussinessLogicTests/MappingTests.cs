using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using BussinessLogic.Mappings;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Models.Models;
using Contracts.DTO;

namespace UnitTests
{
    [TestClass]
    public class MappingTests
    {
        [TestMethod]
        public void ShouldMapMetricToDto()
        {
            //Arrange
            var mapping = new Mapping();
            var source = new Metric
            {
                MetricId = 1,
                DataType = "integer",
                Description = "Test Metric",
                DisplayName = "Test Metric",
                Mnemonic = "TestMetric",
                Group = new MetricGroup
                {
                    GroupName = "Test Group",
                    GroupId = 1,
                }
            };
            //Act
            MetricDto destination = mapping.MetricToDto(source);

            //Assert
            Assert.IsNotNull(destination);
            Assert.IsInstanceOfType(destination, typeof(MetricDto));
            Assert.AreNotEqual(source, destination);
            Assert.AreEqual(source.Group, destination.Group);
            Assert.AreEqual(source.MetricId, destination.MetricId);
            Assert.AreEqual(source.DataType, destination.DataType);
            Assert.AreEqual(source.Description, destination.Description);
            Assert.AreEqual(source.DisplayName, destination.DisplayName);
        }

        [TestMethod]
        public void ShouldMapReportComponentToDto()
        {
            //Arrange
            var mapping = new Mapping();
            var source = new ReportComponent
            {
                Id = 1,
                SubmissionDate = DateTime.Now,
                Title = "Test",
                Type = 1,
                Data = new ReportComponentData
                {
                    Dimensions = new List<Dimension> {new Dimension {DimensionId = 1}},
                    Filters = new List<Filter> {new Filter {FilterId = 1}},
                    Metrics = new List<Metric>
                    {
                        new Metric
                        {
                            MetricId = 1,
                            DataType = "integer",
                            Description = "Test Metric",
                            DisplayName = "Test Metric",
                            Mnemonic = "TestMetric",
                            Group = new MetricGroup
                            {
                                GroupName = "Test Group",
                                GroupId = 1,
                            }

                        }
                    }
                }
            };

            //Act
            ReportComponentDto destination = mapping.ReportComponentToDto(source);

            //Assert
            Assert.AreNotSame(source, destination);
            Assert.IsInstanceOfType(destination, typeof(ReportComponentDto));
            Assert.AreEqual(source.Title, destination.Title);
            Assert.AreEqual(source.Id, destination.Id);
            Assert.AreEqual(source.Data.Metrics, destination.Metrics);
            Assert.AreEqual(source.Data.Filters, destination.Filters);
            Assert.AreEqual(source.Data.Dimensions, destination.Dimensions);
            Assert.AreEqual(source.Type, destination.Type);
        }

        [TestMethod]
        public void ShouldMapDtoToComponent()
        {
            //Arrange
            var mapping = new Mapping();
            var source = new ReportComponentDto
            {
                Id = 1,
                Title = "Test",
                Type = 1
            };

            //Act
            ReportComponent destination = mapping.DtoToReportComponent(source);

            //Assert
            Assert.AreNotSame(source, destination);
            Assert.IsInstanceOfType(destination, typeof(ReportComponent));
            Assert.AreEqual(source.Title, destination.Title);
            Assert.AreEqual(source.Id, destination.Id);
            Assert.AreEqual(source.Type, destination.Type);
        }

        [TestMethod]
        public void ShouldMapComponentListToDtos()
        {
            //Arrange
            var mapping = new Mapping();
            #region var source
            IEnumerable<ReportComponent> source = new List<ReportComponent>
            {
                new ReportComponent
                {
                    Id = 1,
                    SubmissionDate = DateTime.Now,
                    Title = "Test",
                    Type = 1,
                    Data = new ReportComponentData
                    {
                        Dimensions = new List<Dimension> {new Dimension {DimensionId = 1}},
                        Filters = new List<Filter> {new Filter {FilterId = 1}},
                        Metrics = new List<Metric>
                        {
                            new Metric
                            {
                                MetricId = 1,
                                DataType = "integer",
                                Description = "Test Metric",
                                DisplayName = "Test Metric",
                                Mnemonic = "TestMetric",
                                Group = new MetricGroup
                                {
                                    GroupName = "Test Group",
                                    GroupId = 1,
                                }

                            }
                        }
                    }
                },
                new ReportComponent
                {
                    Id = 2,
                    SubmissionDate = DateTime.Now,
                    Title = "Test2",
                    Type = 1,
                    Data = new ReportComponentData
                    {
                        Dimensions = new List<Dimension> {new Dimension {DimensionId = 2}},
                        Filters = new List<Filter> {new Filter {FilterId = 2}},
                        Metrics = new List<Metric>
                        {
                            new Metric
                            {
                                MetricId = 2,
                                DataType = "string",
                                Description = "Test Metric2",
                                DisplayName = "Test Metric2",
                                Mnemonic = "TestMetric2",
                                Group = new MetricGroup
                                {
                                    GroupName = "Test Group2",
                                    GroupId = 2,
                                }

                            }
                        }
                    }
                }
            };
            #endregion
            //Act
            IEnumerable<ReportComponentDto> destination = mapping.ReportComponentToDto(source);

            //Assert
            Assert.AreNotSame(source, destination);
            Assert.IsInstanceOfType(destination, typeof(IEnumerable<ReportComponentDto>));
        }
    }
}
