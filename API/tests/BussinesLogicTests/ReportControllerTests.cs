using System;
using System.Collections;
using System.Collections.Generic;
using BussinessLogic.Handlers;
using BussinessLogic.Handlers.Base;
using Contracts.Responses;
using DataLayer.Base;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Models.DTO;
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
            // arrange
            var repository = new Mock<IComponentRepository>();
            repository.Setup(x => x.Add(It.IsAny<ReportComponent>())).Returns(1);
            const string title = "AddHandler";
            var handler = new AddHandler(repository.Object);
            var ReportDTO = new ReportComponentDTO() { Title = title };

            // act
            var result = handler.Handle(ReportDTO);

            // assert
            Assert.IsNotNull(result.ReportComponentDtos[0].Id);
            Assert.AreEqual(result.ReportComponentDtos[0].Title, title);
            Assert.IsNull(result.Errors);
            Assert.IsInstanceOfType(result, typeof(ReportComponentResponse));
        }
        [TestMethod]
        public void GetHandler_ValidatesData()
        {
            // arrange
            var repository = new Mock<IComponentRepository>(MockBehavior.Strict);
            var testReportComponent = new ReportComponent()
            {
                Title = "GetHandler",
                Id = 1
            };
            repository.Setup(x => x.Get(It.Is<int>(id => id == 1))).Returns(testReportComponent);
            var handler = new GetHandler(repository.Object);

            // act
            var result = handler.Handle(1);

            // assert
            Assert.IsNull(result.Errors);
            Assert.IsNotNull(result.ReportComponentDtos[0].Title);
            //            Assert.IsNull(result.ReportComponentDtos[1]);
            Assert.AreEqual(testReportComponent.Title, result.ReportComponentDtos[0].Title);
            Assert.AreEqual(testReportComponent.Id, result.ReportComponentDtos[0].Id);

        }

        [TestMethod]
        public void GetAllHandler_ValidatesData()
        {
            // arrange
            var repository = new Mock<IComponentRepository>(MockBehavior.Strict);

            IEnumerable<ReportComponent> list = new List<ReportComponent>()
            {
                new ReportComponent()
                {
                    Id = 1,
                    Title = "Pirmas"
                },
                new ReportComponent()
                {
                    Id = 2,
                    Title = "Antras"
                }
            };

            repository.Setup(x => x.GetAll()).Returns(list);

            var handler = new GetAllHandler(repository.Object);

            // act
            var result = handler.Handle(0);

            // assert
            Assert.IsNotNull(result.ReportComponentDtos[0].Id);
            Assert.IsNotNull(result.ReportComponentDtos[1].Id);
            Assert.IsNull(result.Errors);
        }
    }
}