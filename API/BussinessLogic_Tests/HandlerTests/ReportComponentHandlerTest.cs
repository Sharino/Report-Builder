using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using BussinessLogic.Handlers;
using Models.Models;

namespace BussinessLogic_Tests.HandlerTests
{
    [TestClass]
    public class ReportComponentHandlerTest
    {
        [TestMethod]
        public void Add()
        {
            // arrange
            var report = new ReportComponent()
            {
                ComponentType = 1,
                Id = 9000,
                SubmissionDate = DateTime.Now,
                Title = "Testinis Reportas"
            };
            var handler = new ReportComponentHandler();
            
            // act
            handler.Add(report);
            

            // assert
            
            Assert.IsNotNull(report);

        }
        [TestMethod]
        public void GetAll()
        {
            // arrange
          
            // act
           
            // assert
        }
        [TestMethod]
        public void Get()
        {
            // arrange

            // act

            // assert
        }
        [TestMethod]
        public void Remove()
        {
            // arrange

            // act

            // assert
        }
    }
}
