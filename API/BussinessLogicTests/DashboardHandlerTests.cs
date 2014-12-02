using BussinessLogic.Handlers.DashboardHandlers;
using DataLayer.Repositories;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace BussinessLogicTests
{
    [TestClass]
    public class DashboardHandlerTests
    {
        [TestMethod]
        public void DashboardAddHandlerValidatesWhetherComponentsExist()
        {
            //Arrange
            var repository = new Mock<IDashboardRepository>();
            repository.Setup(x => x.Exists(It.IsAny<int>())).Returns(false);

            var handler = new DashboardGetHandler(repository.Object);
            //Act
            handler.Handle(1);

            //Assert
            Assert.IsNotNull(handler.Errors);
            Assert.IsTrue(handler.Errors.Count > 0);
        }

        [TestMethod]
        public void DashboardGetHandlerValidatesExistence()
        {
            //Arrange
            var repository = new Mock<IDashboardRepository>();
            repository.Setup(x => x.Exists(It.IsAny<int>())).Returns(false);

            var handler = new DashboardGetHandler(repository.Object);
            //Act
            handler.Handle(1);

            //Assert
            Assert.IsNotNull(handler.Errors);
            Assert.IsTrue(handler.Errors.Count > 0);
        }
    }
}
