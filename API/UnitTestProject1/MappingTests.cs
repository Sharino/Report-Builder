using System;
using System.Collections.Generic;
using BussinessLogic.Mappings;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Models.DTO;
using Models.Models;

namespace UnitTests
{
    [TestClass]
    public class MappingTests
    {
        [TestMethod]
        public void ShouldMapReportComponentToDto()
        {
            //Arrange
            Mapping mapping = new Mapping();
            ReportComponent source = new ReportComponent
            {
                Id = 1,
                SubmissionDate = DateTime.Now,
                Title = "Test",
                Type = 1
            };

            //Act
            ReportComponentDTO destination = mapping.ReportComponentToDto(source);

            //Assert
            Assert.AreNotSame(source, destination);
            Assert.IsInstanceOfType(destination, typeof(ReportComponentDTO));
            Assert.AreEqual(source.Title, destination.Title);
            Assert.AreEqual(source.Id, destination.Id);
            Assert.AreEqual(source.Type, destination.Type);
        }

        [TestMethod]
        public void ShouldMapDtoToComponent()
        {
            //Arrange
            Mapping mapping = new Mapping();
            ReportComponentDTO source = new ReportComponentDTO
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
            Mapping mapping = new Mapping();
            IEnumerable<ReportComponent> source = new List<ReportComponent>
            {
                new ReportComponent
                {
                    Id = 1,
                    SubmissionDate = DateTime.Now,
                    Title = "First Test Item",
                    Type = 1
                },
                new ReportComponent
                {
                    Id = 2,
                    SubmissionDate = DateTime.Now,
                    Title = "Second Test Item",
                    Type = 2,
                }
            };

            //Act
            IEnumerable<ReportComponentDTO> destination = mapping.ReportComponentToDto(source);

            //Assert
            Assert.AreNotSame(source, destination);
            Assert.IsInstanceOfType(destination, typeof(IEnumerable<ReportComponentDTO>));
        }
    }
}
