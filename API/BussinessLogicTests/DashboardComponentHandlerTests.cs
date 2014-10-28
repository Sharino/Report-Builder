using BussinessLogic.Handlers.DashboardComponentHandlers;
using Contracts.Responses;
using DataLayer.Repositories;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Models.Models;
using Moq;

namespace BussinessLogicTests
{
    [TestClass]
    public class DashboardComponentHandlerTests
    {
        [TestMethod]
        public void ShouldAddDashboardComponent()
        {
            //Arrange
            var reportComponent = new ReportComponent
            {
                CreationDate = "deittoim.neu",
                Data = new ComponentData {Dimensions = null, Filters = null, Metrics = null},
                Id = 1,
                Title = "test",
                Type = 1
            };

            var dashboardComponentRepository = new Mock<IDashboardComponentRepository>();
            dashboardComponentRepository.Setup(x => x.Add(It.IsAny<DashboardComponent>())).Returns(1);

            var reportComponentRepository = new Mock<IReportComponentRepository>();
            reportComponentRepository.Setup(x => x.Get(It.IsAny<int>())).Returns(reportComponent);

            var handler = new DashboardComponentAddHandler(dashboardComponentRepository.Object, reportComponentRepository.Object);

            //Act
            var result = handler.HandleCore(1, 1);

            //Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result, typeof(DashboardComponentResponse));
        }

        [TestMethod]
        public void ShouldGetDashboardComponent()
        {
            //Arrange
            var repository = new Mock<IDashboardComponentRepository>();
            var dashboardComponent = new DashboardComponent
            {
                Id = 1,
                CreationDate = "deittaim.nao",
                DashboardId = 1,
                Definition = "[]",
                Title = "test",
                Type = 1
            };

            repository.Setup(x => x.Get(It.IsAny<int>())).Returns(dashboardComponent);
            var handler = new DashboardComponentGetHandler(repository.Object);

            //Act
            var result = handler.HandleCore(1);

            //Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result, typeof(DashboardComponentResponse));
        }

        [TestMethod]
        public void DashboardComponentAddHandlerValidatesDashboardsExistence()
        {
            //Arrange
            var repository = new Mock<IDashboardComponentRepository>();
            repository.Setup(x => x.DashboardExists(It.IsAny<int>())).Returns(false);
            repository.Setup(x => x.ReportComponentExists(It.IsAny<int>())).Returns(true);

            var handler = new DashboardComponentAddHandler(repository.Object);
            //Act
            handler.Validate(1, 1);

            //Assert
            Assert.IsNotNull(handler.Errors);
            Assert.IsTrue(handler.Errors.Count > 0);
        }

        [TestMethod]
        public void DashboardComponentAddHandlerValidatesReportComponentsExistence()
        {
            //Arrange
            var repository = new Mock<IDashboardComponentRepository>();
            repository.Setup(x => x.DashboardExists(It.IsAny<int>())).Returns(true);
            repository.Setup(x => x.ReportComponentExists(It.IsAny<int>())).Returns(false);

            var handler = new DashboardComponentAddHandler(repository.Object);
            //Act
            handler.Validate(1, 1);

            //Assert
            Assert.IsNotNull(handler.Errors);
            Assert.IsTrue(handler.Errors.Count > 0);
        }

        [TestMethod]
        public void DashboardComponentDeleteHandlerShouldValidateItsExistence()
        {
            //Arrange
            var repository = new Mock<IDashboardComponentRepository>();
            repository.Setup(x => x.Exists(It.IsAny<int>())).Returns(false);

            var handler = new DashboardComponentDeleteHandler(repository.Object);
            //Act
            handler.Handle(1);

            //Assert
            Assert.IsNotNull(handler.Errors);
            Assert.IsTrue(handler.Errors.Count > 0);
        }

        [TestMethod]
        public void DashboardComponentGetHandlerValidatesItsExistence()
        {
            //Arrange
            var repository = new Mock<IDashboardComponentRepository>();
            repository.Setup(x => x.Exists(It.IsAny<int>())).Returns(false);

            var handler = new DashboardComponentGetHandler(repository.Object);
            //Act
            handler.Handle(1);

            //Assert
            Assert.IsNotNull(handler.Errors);
            Assert.IsTrue(handler.Errors.Count > 0);
        }
    }
}
