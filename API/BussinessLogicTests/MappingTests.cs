using System.Collections.Generic;
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
                Title = "Test",
                Type = 1,
                Data = new ComponentData
                {
                    Dimensions = new List<Dimension> {new Dimension {DimensionId = 1}},
                    Filters = new List<Filter> {new Filter {FilterId = 1}},
                    Metrics = new List<Metric> {new Metric {MetricId = 1}}
                }
            };

            //Act
            ReportComponentDto destination = mapping.ReportComponentToDto(source);

            //Assert
            Assert.AreNotSame(source, destination);
            Assert.IsInstanceOfType(destination, typeof(ReportComponentDto));
            Assert.AreEqual(source.Title, destination.Title);
            Assert.AreEqual(source.Id, destination.Id);
            Assert.AreEqual(source.Data.Metrics.Count, destination.Metrics.Count);
            Assert.AreEqual(source.Data.Filters.Count, destination.Filters.Count);
            Assert.AreEqual(source.Data.Dimensions.Count, destination.Dimensions.Count);
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
                Type = 1,
                Dimensions = new List<Dimension>{new Dimension{DimensionId = 1}},
                Filters = new List<Filter>{new Filter{FilterId = 1}},
                Metrics = new List<MetricDto>{new MetricDto{DataType = " ", Description = " ", DisplayName = " ", Group = new MetricGroup{GroupId = 1, GroupName = " "}, MetricId = 1, Mnemonic = " "}},
                SubmissionDate = "now"
            };

            //Act
            ReportComponent destination = mapping.DtoToReportComponent(source);

            //Assert
            Assert.AreNotSame(source, destination);
            Assert.IsInstanceOfType(destination, typeof(ReportComponent));
            Assert.AreEqual(source.Title, destination.Title);
            Assert.AreEqual(source.Id, destination.Id);
            Assert.AreEqual(source.Type, destination.Type);
            Assert.AreEqual(source.Dimensions.Count, destination.Data.Dimensions.Count);
            Assert.AreEqual(source.Filters.Count, destination.Data.Filters.Count);
            Assert.AreEqual(source.Metrics.Count, destination.Data.Metrics.Count);
        }

        [TestMethod]
        public void ShouldMapComponentListToDtos()
        {
            //Arrange
            var mapping = new Mapping();
            #region var source
            var source = new List<ReportComponent>
            {
                new ReportComponent
                {
                    Id = 1,
                    Title = "Test",
                    Type = 1,
                    Data = new ComponentData
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
                    Title = "Test2",
                    Type = 1,
                    Data = new ComponentData
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
            List<ReportComponentDto> destination = mapping.ReportComponentToDto(source);

            //Assert
            Assert.AreNotSame(source, destination);
            Assert.IsInstanceOfType(destination, typeof(List<ReportComponentDto>));
        }
    }
}
