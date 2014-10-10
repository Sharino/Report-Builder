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
        public void AddHandler_ValidatesData()
        {
            //Arrange
            var repository = new Mock<IComponentRepository>();
            repository.Setup(x => x.Add(It.IsAny<ReportComponent>())).Returns(1);

            var reportDto = new ReportComponentDto
            {
                Dimensions = null,
                Filters = null,
                Metrics = null,
                Id = 1,
                Title = "Test",
                Type = 1
            };
            var handler = new AddHandler(repository.Object);
            //Act
            var result = handler.Handle(reportDto);

            //Assert
            Assert.IsNotNull(result);
            Assert.IsNull(result.Errors);
            Assert.AreEqual(reportDto.Title, result.ReportComponentDtos[0].Title);
            Assert.IsInstanceOfType(result, typeof(ReportComponentResponse));
        }
        [TestMethod]
        public void GetHandler_ValidatesData()
        {
            //Arrange
            var repository = new Mock<IComponentRepository>();
            var report = new ReportComponent
            {
                Data = new ReportComponentData
                {
                    Dimensions = new List<Dimension> { new Dimension { DimensionId = 1 } },
                    Metrics = new List<Metric> { new Metric { MetricId = 1 } },
                    Filters = new List<Filter> { new Filter { FilterId = 1 } }
                },
                Title = "Test",
                Id = 1,
                SubmissionDate = DateTime.Now,
                Type = 1
            };
            repository.Setup(x => x.Get(It.IsAny<int>())).Returns(report);
            var handler = new GetHandler(repository.Object);

            //Act
            var result = handler.HandleCore(1);

            //Assert
            Assert.IsNotNull(result);
            Assert.IsNull(result.Errors);
            Assert.IsNotNull(result.ReportComponentDtos[0]);
            Assert.AreEqual(report.Title, result.ReportComponentDtos[0].Title);
            Assert.AreEqual(report.Id, result.ReportComponentDtos[0].Id);
            Assert.AreEqual(report.Type, result.ReportComponentDtos[0].Type);
        }

        [TestMethod]
        public void GetAllHandler_ValidatesData()
        {
            //Arrange
            var repository = new Mock<IComponentRepository>(MockBehavior.Strict);

            IEnumerable<ReportComponent> list = new List<ReportComponent>()
            {
                new ReportComponent
                {
                    Data = new ReportComponentData
                    {
                        Dimensions = new List<Dimension>{new Dimension { DimensionId = 1}},
                        Metrics = new List<Metric>{new Metric { MetricId = 1}},
                        Filters = new List<Filter>{new Filter { FilterId= 1}}
                    },
                    Title = "Test",
                    Id = 1,
                    SubmissionDate = DateTime.Now,
                    Type = 1
                },
                new ReportComponent
                {
                    Data = new ReportComponentData
                    {
                        Dimensions = new List<Dimension>{new Dimension { DimensionId = 2}},
                        Metrics = new List<Metric>{new Metric { MetricId = 2}},
                        Filters = new List<Filter>{new Filter { FilterId= 2}}
                    },
                    Title = "Test",
                    Id = 2,
                    SubmissionDate = DateTime.Now,
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
            Assert.IsNull(result.Errors);
        }
    }
}