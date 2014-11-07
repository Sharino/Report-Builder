using System;
using System.Collections.Generic;
using BussinessLogic.Handlers.ReportComponentHandlers;
using Contracts.Responses;
using DataLayer.Repositories;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Contracts.DTO;
using Models.Models;
using Moq;

namespace BussinessLogicTests
{
    [TestClass]
    public class ReportComponentHandlerTests
    {
        [TestMethod]
        public void GetHandler_ValidatesData()
        {
            //Arrange
            var repository = new Mock<IReportComponentRepository>();
            var report = new ReportComponent
            {
                Data = new ComponentData
                {
                    Dimensions = new List<Dimension> { new Dimension { DimensionId = 1 } },
                    Metrics = new List<Metric> { new Metric { MetricId = 1 } },
                    Filters = new List<Filter> { new Filter { FilterId = 1 } }
                },
                Title = "Test",
                Id = 1,
                Type = 1
            };
            repository.Setup(x => x.Get(It.IsAny<int>())).Returns(report);
            var handler = new GetHandler(repository.Object);

            //Act
            var result = handler.HandleCore(1);

            //Assert
            Assert.IsNotNull(result);
            Assert.IsNotNull(result.ReportComponentDtos[0]);
            Assert.AreEqual(report.Title, result.ReportComponentDtos[0].Title);
            Assert.AreEqual(report.Id, result.ReportComponentDtos[0].Id);
            Assert.AreEqual(report.Type, result.ReportComponentDtos[0].Type);
        }

        [TestMethod]
        public void GetAllHandler_ValidatesData()
        {
            //Arrange
            var repository = new Mock<IReportComponentRepository>(MockBehavior.Strict);

            IEnumerable<ReportComponent> list = new List<ReportComponent>()
            {
                new ReportComponent
                {
                    Data = new ComponentData
                    {
                        Dimensions = new List<Dimension>{new Dimension { DimensionId = 1}},
                        Metrics = new List<Metric>{new Metric { MetricId = 1}},
                        Filters = new List<Filter>{new Filter { FilterId= 1}}
                    },
                    Title = "Test",
                    Id = 1,
                    Type = 1
                },
                new ReportComponent
                {
                    Data = new ComponentData
                    {
                        Dimensions = new List<Dimension>{new Dimension { DimensionId = 2}},
                        Metrics = new List<Metric>{new Metric { MetricId = 2}},
                        Filters = new List<Filter>{new Filter { FilterId= 2}}
                    },
                    Title = "Test",
                    Id = 2,
                    Type = 2
                }
            };

            repository.Setup(x => x.GetAll()).Returns(list);

            var handler = new GetAllHandler(repository.Object);

            //Act
            var result = handler.Handle(0);

            //Assert
            Assert.IsNotNull(result);
            Assert.IsNotNull(result.ReportComponentDtos[0]);
            Assert.IsNotNull(result.ReportComponentDtos[1]);
        }
    }
}