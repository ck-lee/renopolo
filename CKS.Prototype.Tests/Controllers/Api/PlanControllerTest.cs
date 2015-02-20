using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using CKS.Contracts;
using CKS.Entities;
using CKS.Prototype.Controllers.Api;
using CKS.ViewModels.Plan;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace CKS.Prototype.Tests.Controllers.Api
{
    [TestClass]
    public class PlanControllerTest
    {
        private PlanController _planController;
        private Mock<ILogger> _loggerMock;
        private Mock<IPrototypeUow> _prototypeUowMock;
        private Mock<IWebSecurity> _webSecurityMock;
        private Mock<HttpContextBase> _httpContextBaseMock;

        [TestInitialize]
        public void Initialize()
        {
            _loggerMock = new Mock<ILogger>();
            _prototypeUowMock = new Mock<IPrototypeUow>();
            _webSecurityMock = new Mock<IWebSecurity>();
            _httpContextBaseMock = new Mock<HttpContextBase>();
            _planController = new PlanController(_loggerMock.Object, _prototypeUowMock.Object, _webSecurityMock.Object, _httpContextBaseMock.Object);
            _prototypeUowMock.Setup(p => p.UserProfiles.GetByEmail(It.IsAny<string>())).Returns(ObjectMother.UserProfile).Verifiable();
            _prototypeUowMock.Setup(p => p.Projects.Add(It.IsAny<Project>())).Verifiable();
            _prototypeUowMock.Setup(p => p.Projects.GetById(1234)).Returns(new Project{CreatedDate = new DateTime(2013,7,14)}).Verifiable();

            _webSecurityMock.Setup(p => p.CurrentUserName()).Returns("test@test.com").Verifiable();
        }

        [TestMethod]
        public void PostProjectShouldSaveToDatabaseIfAuthenticated()
        {
            _webSecurityMock.Setup(p => p.IsAuthenticated()).Returns(true);
            var saveProjectRequest = new SaveProjectRequest
                                         {
                                             Project = new Project
                                                           {
                                                               SystemOfMeasurement = "Metric",
                                                               Title = "Title"
                                                           }
                                         };
            var response = _planController.PutProject(saveProjectRequest);
            _prototypeUowMock.Verify(p => p.Projects.Add(It.IsAny<Project>()), Times.Once());
            _webSecurityMock.Verify(p => p.CurrentUserName(), Times.Once());
            Assert.IsTrue(response.Successful);
        }

        [TestMethod]
        [ExpectedException(typeof(HttpResponseException))]
        public void PostProjectShouldNotSaveToDatabaseIfNotAuthenticated()
        {
            _webSecurityMock.Setup(p => p.IsAuthenticated()).Returns(false);
            var saveProjectRequest = new SaveProjectRequest
            {
                Project = new Project
                {
                    SystemOfMeasurement = "Metric",
                    Title = "Title"
                }
            };
            var response = _planController.PutProject(saveProjectRequest);
        }

        [TestMethod]
        [ExpectedException(typeof(HttpResponseException))]
        public void PostProjectShouldNotSaveToDatabaseIfCreatedDateIsNotTheSame()
        {
            _webSecurityMock.Setup(p => p.IsAuthenticated()).Returns(true);
            var saveProjectRequest = new SaveProjectRequest
            {
                Project = new Project
                {
                    SystemOfMeasurement = "Metric",
                    Title = "Title",
                    Id = 1234,
                    CreatedDate = new DateTime(1999, 7, 14)
                }
            };
            var response = _planController.PutProject(saveProjectRequest);
        }

        [TestMethod]
        public void PostProjectShouldSaveToDatabaseIfCreatedDateTheSame()
        {
            _webSecurityMock.Setup(p => p.IsAuthenticated()).Returns(true);
            var saveProjectRequest = new SaveProjectRequest
                                         {
                                             Project = ObjectMother.Project
                                         };
            var response = _planController.PutProject(saveProjectRequest);
            Assert.IsTrue(response.Successful);
            _prototypeUowMock.Verify(p => p.Projects.Update(It.IsAny<Project>()), Times.Once());
            _prototypeUowMock.Verify(p => p.Projects.GetById(1234), Times.AtLeastOnce());
            _webSecurityMock.Verify(p => p.CurrentUserName(), Times.AtLeastOnce());
        }



        [TestMethod]
        public void GetProjectsSuccessfulIfAuthenticated()
        {
            _webSecurityMock.Setup(p => p.IsAuthenticated()).Returns(true);
            var response = _planController.GetProjects();

            _prototypeUowMock.Verify(p => p.UserProfiles.GetByEmail(It.IsAny<string>()), Times.Once());
            _webSecurityMock.Verify(p => p.CurrentUserName(), Times.Once());
            Assert.IsNotNull(response);
        }

        [TestMethod]
        [ExpectedException(typeof(HttpResponseException))]
        public void GetProjectsNotSuccessfulIfNotAuthenticated()
        {
            _webSecurityMock.Setup(p => p.IsAuthenticated()).Returns(false);
            var response = _planController.GetProjects();
        }

        [TestMethod]
        public void PutAdjustments_UpdateExistingAdjustment()
        {
            _webSecurityMock.Setup(p => p.IsAuthenticated()).Returns(true);
            var httpRequestMock = new Mock<HttpRequestBase>();
            var httpCookies = new HttpCookieCollection();
            httpCookies.Add(new HttpCookie("ted", "test"));
            httpRequestMock.Setup(p => p.Cookies).Returns(httpCookies);
            _httpContextBaseMock.Setup(p => p.Request).Returns(httpRequestMock.Object).Verifiable();
            var saveProjectRequest = new SaveProjectRequest
                                         {
                                             Project = ObjectMother.Project
                                         };
            saveProjectRequest.Project.Sections.First().Adjustments.First().Quantity = 5;
            saveProjectRequest.Project.Sections.First().Adjustments.First().Total = 500;
            //session
            var sessionRepositoryMock = new Mock<ISessionRepository>();
            sessionRepositoryMock.Setup(p => p.GetByUniqueNumber(It.IsAny<string>()))
                                 .Returns(new Session() { UniqueNumber = "test", IPAddress = "127.0.0.1" });
            _prototypeUowMock.SetupGet(p => p.Sessions).Returns(sessionRepositoryMock.Object);
            //section
            var sectionRepsitoryMock = new Mock<ISectionRepository>();
            var databaseSection = ObjectMother.Section;
            databaseSection.Project = new Project {UserProfile = new UserProfile {Email = "test@test.com"}};
            sectionRepsitoryMock.Setup(p => p.GetById(100)).Returns(databaseSection).Verifiable();
            sectionRepsitoryMock.Setup(p => p.AttachWalls(It.IsAny<Section>(),It.IsAny<ICollection<Wall>>())).Verifiable();
            sectionRepsitoryMock.Setup(p => p.AttachAdjustments(It.IsAny<Section>(), It.IsAny<ICollection<Adjustment>>())).Verifiable();
            _prototypeUowMock.SetupGet(p => p.Sections).Returns(sectionRepsitoryMock.Object);
            //adjustment
            var adjustmentRepositoryMock = new Mock<IRepository<Adjustment>>();
            adjustmentRepositoryMock.Setup(p => p.Delete(It.IsAny<Adjustment>())).Verifiable();
            adjustmentRepositoryMock.Setup(p => p.Update(It.IsAny<Adjustment>())).Verifiable();
            _prototypeUowMock.SetupGet(p => p.Adjustments).Returns(adjustmentRepositoryMock.Object);
            var response = _planController.PutAdjustments(saveProjectRequest);
            Assert.IsTrue(response.Successful);
            sectionRepsitoryMock.Verify(p => p.GetById(100),Times.Once());
            sectionRepsitoryMock.Verify(p => p.AttachWalls(It.IsAny<Section>(),It.IsAny<ICollection<Wall>>()), Times.Never());
            sectionRepsitoryMock.Verify(p => p.AttachAdjustments(It.IsAny<Section>(), It.IsAny<ICollection<Adjustment>>()), Times.Once());
        
        }

        

        [TestMethod]
        public void PutAdjustments_InsertNewAdjustment()
        {
            _webSecurityMock.Setup(p => p.IsAuthenticated()).Returns(true);
            var httpRequestMock = new Mock<HttpRequestBase>();
            var httpCookies = new HttpCookieCollection();
            httpCookies.Add(new HttpCookie("ted", "test"));
            httpRequestMock.Setup(p => p.Cookies).Returns(httpCookies);
            _httpContextBaseMock.Setup(p => p.Request).Returns(httpRequestMock.Object).Verifiable();
            var saveProjectRequest = new SaveProjectRequest
            {
                Project = ObjectMother.Project
            };
            var section = ObjectMother.Section;
            section.Adjustments = new Collection<Adjustment>();
            saveProjectRequest.Project.Sections.First().Adjustments.First().Id = null;
            //session
            var sessionRepositoryMock = new Mock<ISessionRepository>();
            sessionRepositoryMock.Setup(p => p.GetByUniqueNumber(It.IsAny<string>()))
                                 .Returns(new Session() { UniqueNumber = "test", IPAddress = "127.0.0.1" });
            _prototypeUowMock.SetupGet(p => p.Sessions).Returns(sessionRepositoryMock.Object);
            //section
            var sectionRepsitoryMock = new Mock<ISectionRepository>();
            var databaseSection = ObjectMother.Section;
            databaseSection.Project = new Project { UserProfile = new UserProfile { Email = "test@test.com" } };
            databaseSection.Adjustments = new Collection<Adjustment>();
            sectionRepsitoryMock.Setup(p => p.AttachWalls(It.IsAny<Section>(), It.IsAny<ICollection<Wall>>())).Verifiable();
            sectionRepsitoryMock.Setup(p => p.AttachAdjustments(It.IsAny<Section>(), It.IsAny<ICollection<Adjustment>>())).Verifiable();
            sectionRepsitoryMock.Setup(p => p.GetById(100)).Returns(databaseSection).Verifiable();
            _prototypeUowMock.SetupGet(p => p.Sections).Returns(sectionRepsitoryMock.Object);
            var response = _planController.PutAdjustments(saveProjectRequest);
            Assert.IsTrue(response.Successful);
            sectionRepsitoryMock.Verify(p => p.GetById(100), Times.Once());
            sectionRepsitoryMock.Verify(p => p.AttachWalls(It.IsAny<Section>(), It.IsAny<ICollection<Wall>>()), Times.Never());
            sectionRepsitoryMock.Verify(p => p.AttachAdjustments(It.IsAny<Section>(), It.IsAny<ICollection<Adjustment>>()), Times.Once());
        }

        [TestMethod]
        public void PutAdjustments_DeleteExistingAdjustment()
        {
            _webSecurityMock.Setup(p => p.IsAuthenticated()).Returns(true);
            var httpRequestMock = new Mock<HttpRequestBase>();
            var httpCookies = new HttpCookieCollection();
            httpCookies.Add(new HttpCookie("ted", "test"));
            httpRequestMock.Setup(p => p.Cookies).Returns(httpCookies);
            _httpContextBaseMock.Setup(p => p.Request).Returns(httpRequestMock.Object).Verifiable();
            var saveProjectRequest = new SaveProjectRequest
            {
                Project = ObjectMother.Project
            };
            saveProjectRequest.Project.Sections.First().Adjustments = new Collection<Adjustment>();
            //session
            var sessionRepositoryMock = new Mock<ISessionRepository>();
            sessionRepositoryMock.Setup(p => p.GetByUniqueNumber(It.IsAny<string>()))
                                 .Returns(new Session() { UniqueNumber = "test", IPAddress = "127.0.0.1" });
            _prototypeUowMock.SetupGet(p => p.Sessions).Returns(sessionRepositoryMock.Object);
            //section
            var sectionRepsitoryMock = new Mock<ISectionRepository>();
            var databaseSection = ObjectMother.Section;
            databaseSection.Project = new Project { UserProfile = new UserProfile { Email = "test@test.com" } };
            sectionRepsitoryMock.Setup(p => p.GetById(100)).Returns(databaseSection).Verifiable();
            _prototypeUowMock.SetupGet(p => p.Sections).Returns(sectionRepsitoryMock.Object);
            //adjustment
            var adjustmentRepositoryMock = new Mock<IRepository<Adjustment>>();
            _prototypeUowMock.SetupGet(p => p.Adjustments).Returns(adjustmentRepositoryMock.Object);
            var response = _planController.PutAdjustments(saveProjectRequest);
            Assert.IsTrue(response.Successful);
            sectionRepsitoryMock.Verify(p => p.GetById(100), Times.Once());
            
        }

        [TestMethod]
        [ExpectedException(typeof(HttpResponseException))]
        public void PutAdjustments_Unauthorized()
        {
            _webSecurityMock.Setup(p => p.IsAuthenticated()).Returns(false);
            var httpRequestMock = new Mock<HttpRequestBase>();
            var httpCookies = new HttpCookieCollection();
            httpCookies.Add(new HttpCookie("ted", "test"));
            httpRequestMock.Setup(p => p.Cookies).Returns(httpCookies);
            _httpContextBaseMock.Setup(p => p.Request).Returns(httpRequestMock.Object).Verifiable();
            var saveProjectRequest = new SaveProjectRequest
            {
                Project = ObjectMother.Project
            };
            saveProjectRequest.Project.Sections.First().Adjustments.First().Quantity = 5;
            saveProjectRequest.Project.Sections.First().Adjustments.First().Total = 500;
            //session
            var sessionRepositoryMock = new Mock<ISessionRepository>();
            sessionRepositoryMock.Setup(p => p.GetByUniqueNumber(It.IsAny<string>()))
                                 .Returns(new Session() { UniqueNumber = "test", IPAddress = "127.0.0.1" });
            _prototypeUowMock.SetupGet(p => p.Sessions).Returns(sessionRepositoryMock.Object);
            //section
            var sectionRepsitoryMock = new Mock<ISectionRepository>();
            var databaseSection = ObjectMother.Section;
            databaseSection.Project = new Project { UserProfile = new UserProfile { Email = "test@test.com" } };
            sectionRepsitoryMock.Setup(p => p.GetById(100)).Returns(databaseSection).Verifiable();
            _prototypeUowMock.SetupGet(p => p.Sections).Returns(sectionRepsitoryMock.Object);
            //adjustment
            var adjustmentRepositoryMock = new Mock<IRepository<Adjustment>>();
            adjustmentRepositoryMock.Setup(p => p.Delete(It.IsAny<Adjustment>())).Verifiable();
            adjustmentRepositoryMock.Setup(p => p.Update(It.IsAny<Adjustment>())).Verifiable();
            _prototypeUowMock.SetupGet(p => p.Adjustments).Returns(adjustmentRepositoryMock.Object);
            var response = _planController.PutAdjustments(saveProjectRequest);
        }

        [TestMethod]
        [ExpectedException(typeof(HttpResponseException))]
        public void PutAdjustments_Forbidden()
        {
            _webSecurityMock.Setup(p => p.IsAuthenticated()).Returns(true);
            var httpRequestMock = new Mock<HttpRequestBase>();
            var httpCookies = new HttpCookieCollection();
            httpCookies.Add(new HttpCookie("ted", "test"));
            httpRequestMock.Setup(p => p.Cookies).Returns(httpCookies);
            _httpContextBaseMock.Setup(p => p.Request).Returns(httpRequestMock.Object).Verifiable();
            var saveProjectRequest = new SaveProjectRequest
            {
                Project = ObjectMother.Project
            };
            saveProjectRequest.Project.Sections.First().Adjustments.First().Quantity = 5;
            saveProjectRequest.Project.Sections.First().Adjustments.First().Total = 500;
            //session
            var sessionRepositoryMock = new Mock<ISessionRepository>();
            sessionRepositoryMock.Setup(p => p.GetByUniqueNumber(It.IsAny<string>()))
                                 .Returns(new Session() { UniqueNumber = "test", IPAddress = "127.0.0.1" });
            _prototypeUowMock.SetupGet(p => p.Sessions).Returns(sessionRepositoryMock.Object);
            //section
            var sectionRepsitoryMock = new Mock<ISectionRepository>();
            var databaseSection = ObjectMother.Section;
            databaseSection.Project = new Project { UserProfile = new UserProfile { Email = "wrong@email.com" } };
            sectionRepsitoryMock.Setup(p => p.GetById(100)).Returns(databaseSection).Verifiable();
            _prototypeUowMock.SetupGet(p => p.Sections).Returns(sectionRepsitoryMock.Object);
            //adjustment
            var adjustmentRepositoryMock = new Mock<IRepository<Adjustment>>();
            adjustmentRepositoryMock.Setup(p => p.Delete(It.IsAny<Adjustment>())).Verifiable();
            adjustmentRepositoryMock.Setup(p => p.Update(It.IsAny<Adjustment>())).Verifiable();
            _prototypeUowMock.SetupGet(p => p.Adjustments).Returns(adjustmentRepositoryMock.Object);
            var response = _planController.PutAdjustments(saveProjectRequest);
        }

        [TestMethod]
        public void PutAdjustments_FromSession()
        {
            _webSecurityMock.Setup(p => p.IsAuthenticated()).Returns(false);
            var httpRequestMock = new Mock<HttpRequestBase>();
            var httpCookies = new HttpCookieCollection();
            httpCookies.Add(new HttpCookie("ted", "test"));
            httpRequestMock.Setup(p => p.Cookies).Returns(httpCookies);
            _httpContextBaseMock.Setup(p => p.Request).Returns(httpRequestMock.Object).Verifiable();
            var saveProjectRequest = new SaveProjectRequest
            {
                Project = ObjectMother.Project
            };
            saveProjectRequest.Project.Id = null;
            saveProjectRequest.Project.Sections.First().Adjustments.First().Quantity = 5;
            saveProjectRequest.Project.Sections.First().Adjustments.First().Total = 500;
            //session
            var sessionRepositoryMock = new Mock<ISessionRepository>();
            sessionRepositoryMock.Setup(p => p.GetByUniqueNumber("test"))
                                 .Returns(new Session { UniqueNumber = "test", IPAddress = "127.0.0.1" });
            _prototypeUowMock.SetupGet(p => p.Sessions).Returns(sessionRepositoryMock.Object);
            //section
            var sectionRepsitoryMock = new Mock<ISectionRepository>();
            var databaseSection = ObjectMother.Section;
            databaseSection.Session = new Session {UniqueNumber = "test", IPAddress = "127.0.0.1"};
            sectionRepsitoryMock.Setup(p => p.GetById(100)).Returns(databaseSection).Verifiable();
            sectionRepsitoryMock.Setup(p => p.AttachWalls(It.IsAny<Section>(), It.IsAny<ICollection<Wall>>())).Verifiable();
            sectionRepsitoryMock.Setup(p => p.AttachAdjustments(It.IsAny<Section>(), It.IsAny<ICollection<Adjustment>>())).Verifiable();
            _prototypeUowMock.SetupGet(p => p.Sections).Returns(sectionRepsitoryMock.Object).Verifiable();
            //adjustment
            var adjustmentRepositoryMock = new Mock<IRepository<Adjustment>>();
            adjustmentRepositoryMock.Setup(p => p.Delete(It.IsAny<Adjustment>())).Verifiable();
            adjustmentRepositoryMock.Setup(p => p.Update(It.IsAny<Adjustment>())).Verifiable();
            _prototypeUowMock.SetupGet(p => p.Adjustments).Returns(adjustmentRepositoryMock.Object);
            var response = _planController.PutAdjustments(saveProjectRequest);
            Assert.IsTrue(response.Successful);
            sectionRepsitoryMock.Verify(p => p.GetById(100), Times.Once());
            sectionRepsitoryMock.Verify(p => p.AttachWalls(It.IsAny<Section>(), It.IsAny<ICollection<Wall>>()), Times.Never());
            sectionRepsitoryMock.Verify(p => p.AttachAdjustments(It.IsAny<Section>(), It.IsAny<ICollection<Adjustment>>()), Times.Once());
            _prototypeUowMock.Verify(p => p.Sections, Times.AtLeastOnce());
        }

        [TestMethod]
        [ExpectedException(typeof(HttpResponseException))]
        public void PutAdjustments_FromSessionForbidden()
        {
            _webSecurityMock.Setup(p => p.IsAuthenticated()).Returns(false);
            var httpRequestMock = new Mock<HttpRequestBase>();
            var httpCookies = new HttpCookieCollection();
            httpCookies.Add(new HttpCookie("ted", "wrong"));
            httpRequestMock.Setup(p => p.Cookies).Returns(httpCookies);
            _httpContextBaseMock.Setup(p => p.Request).Returns(httpRequestMock.Object).Verifiable();
            var saveProjectRequest = new SaveProjectRequest
            {
                Project = ObjectMother.Project
            };
            saveProjectRequest.Project.Id = null;
            saveProjectRequest.Project.Sections.First().Adjustments.First().Quantity = 5;
            saveProjectRequest.Project.Sections.First().Adjustments.First().Total = 500;
            //session
            var sessionRepositoryMock = new Mock<ISessionRepository>();
            _prototypeUowMock.SetupGet(p => p.Sessions).Returns(sessionRepositoryMock.Object);
            //section
            var sectionRepsitoryMock = new Mock<ISectionRepository>();
            var databaseSection = ObjectMother.Section;
            databaseSection.Session = new Session { UniqueNumber = "test", IPAddress = "127.0.0.1" };
            sectionRepsitoryMock.Setup(p => p.GetById(100)).Returns(databaseSection).Verifiable();
            _prototypeUowMock.SetupGet(p => p.Sections).Returns(sectionRepsitoryMock.Object);
            //adjustment
            var adjustmentRepositoryMock = new Mock<IRepository<Adjustment>>();
            adjustmentRepositoryMock.Setup(p => p.Delete(It.IsAny<Adjustment>())).Verifiable();
            adjustmentRepositoryMock.Setup(p => p.Update(It.IsAny<Adjustment>())).Verifiable();
            _prototypeUowMock.SetupGet(p => p.Adjustments).Returns(adjustmentRepositoryMock.Object);
            var response = _planController.PutAdjustments(saveProjectRequest);            
        }

        [TestMethod]
        public void PostSection_FromSession()
        {
            _webSecurityMock.Setup(p => p.IsAuthenticated()).Returns(false);
            var httpRequestMock = new Mock<HttpRequestBase>();
            var httpCookies = new HttpCookieCollection();
            httpCookies.Add(new HttpCookie("ted", "test"));
            httpRequestMock.Setup(p => p.Cookies).Returns(httpCookies);
            _httpContextBaseMock.Setup(p => p.Request).Returns(httpRequestMock.Object).Verifiable();
            var saveProjectRequest = new SaveProjectRequest
            {
                Project = ObjectMother.Project
            };
            saveProjectRequest.Project.Id = null;
            saveProjectRequest.Project.Sections.First().Adjustments.First().Quantity = 5;
            saveProjectRequest.Project.Sections.First().Adjustments.First().Total = 500;
            //session
            var sessionRepositoryMock = new Mock<ISessionRepository>();
            sessionRepositoryMock.Setup(p => p.GetByUniqueNumber("test"))
                                 .Returns(new Session { UniqueNumber = "test", IPAddress = "127.0.0.1" });
            _prototypeUowMock.SetupGet(p => p.Sessions).Returns(sessionRepositoryMock.Object);
            //section
            var sectionRepsitoryMock = new Mock<ISectionRepository>();
            var databaseSection = ObjectMother.Section;
            databaseSection.Session = new Session { UniqueNumber = "test", IPAddress = "127.0.0.1" };
            sectionRepsitoryMock.Setup(p => p.GetById(100)).Returns(databaseSection).Verifiable();
            sectionRepsitoryMock.Setup(p => p.AttachWalls(It.IsAny<Section>(), It.IsAny<ICollection<Wall>>())).Verifiable();
            sectionRepsitoryMock.Setup(p => p.AttachAdjustments(It.IsAny<Section>(), It.IsAny<ICollection<Adjustment>>())).Verifiable();
            _prototypeUowMock.SetupGet(p => p.Sections).Returns(sectionRepsitoryMock.Object);
            //adjustment
            var adjustmentRepositoryMock = new Mock<IRepository<Adjustment>>();
            _prototypeUowMock.SetupGet(p => p.Adjustments).Returns(adjustmentRepositoryMock.Object);
            var response = _planController.PostSection(saveProjectRequest);
            Assert.IsTrue(response.Successful);
            sectionRepsitoryMock.Verify(p => p.GetById(100), Times.Once());
            sectionRepsitoryMock.Verify(p => p.AttachWalls(It.IsAny<Section>(), It.IsAny<ICollection<Wall>>()), Times.Once());
            sectionRepsitoryMock.Verify(p => p.AttachAdjustments(It.IsAny<Section>(), It.IsAny<ICollection<Adjustment>>()), Times.Never());
        }
    }
}
