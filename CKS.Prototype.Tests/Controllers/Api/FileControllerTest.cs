using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using CKS.Contracts;
using CKS.Entities;
using CKS.Prototype.Controllers.Api;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace CKS.Prototype.Tests.Controllers.Api
{
    [TestClass]
    public class FileControllerTest
    {
        private Mock<ILogger> _loggerMock;
        private Mock<IBlobStorage> _blobStorageMock;
        private Mock<IPrototypeUow> _prototypeUowMock;
        private Mock<HttpContextBase> _httpContextBaseMock;
        private Mock<IApiRequest> _apiRequestMock;
        private FileController _fileController;

        [TestInitialize]
        public void Initialize()
        {
            _loggerMock = new Mock<ILogger>();
            _blobStorageMock = new Mock<IBlobStorage>();
            _prototypeUowMock = new Mock<IPrototypeUow>();
            _httpContextBaseMock = new Mock<HttpContextBase>();
            _apiRequestMock = new Mock<IApiRequest>();
            _fileController = new FileController(_loggerMock.Object, _blobStorageMock.Object, _prototypeUowMock.Object, _httpContextBaseMock.Object, _apiRequestMock.Object);
        }

        [TestMethod]
        public void PostUploadFailsWithoutMultiPartContent()
        {
            _loggerMock.Setup(m => m.Error(It.IsAny<string>())).Verifiable();
            _apiRequestMock.Setup(p => p.IsMimeMultipartContent(It.IsAny<HttpContent>())).Returns(false);
            _fileController.Request = new HttpRequestMessage();
            _fileController.Request.Content = new FormUrlEncodedContent(new Collection<KeyValuePair<string, string>>());
            _fileController.PostFloorPlan();
            _loggerMock.Verify(m=> m.Error(It.IsAny<string>()), Times.Exactly(1));
        }

        [TestMethod]
        public void PostUploadFailsWithoutCookie()
        {
            _loggerMock.Setup(m => m.Error(It.IsAny<string>())).Verifiable();
            var apiRequest = new HttpRequestMessage(HttpMethod.Post, "http://server/api/file/floorplan/");
            _apiRequestMock.Setup(p => p.IsMimeMultipartContent(It.IsAny<HttpContent>())).Returns(true);
            var httpRequestMock = new Mock<HttpRequestBase>();
            var httpCookies = new HttpCookieCollection();
            httpRequestMock.Setup(p => p.Cookies).Returns(httpCookies);
            _httpContextBaseMock.Setup(p => p.Request).Returns(httpRequestMock.Object).Verifiable();
            _fileController.Request = apiRequest;
           
            _fileController.PostFloorPlan();
            
            _loggerMock.Verify(m => m.Error(It.IsAny<string>()), Times.Exactly(1));
        }

        [TestMethod]
        public async Task PostUploadSuccessful()
        {
            _loggerMock.Setup(m => m.Error(It.IsAny<string>())).Verifiable();
            var apiRequest = new HttpRequestMessage(HttpMethod.Post,"http://server/api/file/floorplan/");
            string assemblyPath = Directory.GetCurrentDirectory();
            var stream = new FileStream(assemblyPath + "\\..\\..\\PlanBackground.png", FileMode.Open);
            var provider = new MultipartMemoryStreamProvider();
            provider.Contents.Add(new StreamContent(stream));
            provider.Contents.Add(new StreamContent(stream));
            var idHttpContent = provider.Contents[0];
            var fileHttpContent = provider.Contents[1];
            fileHttpContent.Headers.ContentDisposition = new ContentDispositionHeaderValue("test");
            fileHttpContent.Headers.ContentDisposition.FileName = "test.png";
            var task = new Task<MultipartMemoryStreamProvider>(() => provider);
            task.Start();
            _apiRequestMock.Setup(p => p.IsMimeMultipartContent(It.IsAny<HttpContent>())).Returns(true);
            _apiRequestMock.Setup(p => p.ReadAsMultipartAsync(It.IsAny<HttpContent>(), It.IsAny<MultipartMemoryStreamProvider>())).Returns(task);
            var httpRequestMock = new Mock<HttpRequestBase>();
            var httpCookies = new HttpCookieCollection();
            httpCookies.Add(new HttpCookie("ted","test"));
            httpRequestMock.Setup(p => p.Cookies).Returns(httpCookies);
            _httpContextBaseMock.Setup(p => p.Request).Returns(httpRequestMock.Object).Verifiable();
            _fileController.Request = apiRequest;
            _fileController.Request.Content = new StreamContent(stream);
            var sessionRepositoryMock = new Mock<ISessionRepository>();
            sessionRepositoryMock.Setup(p => p.GetByUniqueNumber(It.IsAny<string>()))
                                 .Returns(new Session() {UniqueNumber = "test", IPAddress = "127.0.0.1"});
            _prototypeUowMock.SetupGet(p => p.Sessions).Returns(sessionRepositoryMock.Object);
            var sectionRepsitoryMock = new Mock<ISectionRepository>();
            sectionRepsitoryMock.Setup(p => p.Add(It.IsAny<Section>())).Callback((Section section) => section.Id = 1234);
            sectionRepsitoryMock.Setup(p => p.InsertOrUpdate(It.IsAny<Section>())).Callback((Section section) => section.Id = 1234);
            _prototypeUowMock.SetupGet(p => p.Sections).Returns(sectionRepsitoryMock.Object);
            var postFloorPlanResult = await _fileController.PostFloorPlan();           
            Assert.IsNotNull(postFloorPlanResult);
            Assert.AreEqual(80155, postFloorPlanResult.Size);
            Assert.AreEqual("test.png", postFloorPlanResult.Name);
            _loggerMock.Verify(m => m.Error(It.IsAny<string>()), Times.Exactly(0));
        }
    }
}
