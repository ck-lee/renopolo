using System.Data.Entity;
using System.Web;
using System.Web.Security;
using System.Web.Security.Fakes;
using CKS.Contracts;
using CKS.Entities;
using CKS.Prototype.Controllers.Api;
using CKS.ViewModels.Account;
using Microsoft.QualityTools.Testing.Fakes;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace CKS.Prototype.Tests.Controllers.Api
{
    [TestClass]
    public class AccountControllerTest
    {
        private AccountController _accountController;
        private Mock<ILogger> _loggerMock;
        private Mock<IWebSecurity> _webSecurityMock;
        private Mock<IPrototypeUow> _prototypeUowMock;
        private Mock<HttpContextBase> _httpContextBaseMock;

        [TestInitialize]
        public void Initialize()
        {
            _loggerMock = new Mock<ILogger>();
            _webSecurityMock = new Mock<IWebSecurity>();
            _prototypeUowMock = new Mock<IPrototypeUow>();
            _httpContextBaseMock = new Mock<HttpContextBase>();
            _accountController = new AccountController(_loggerMock.Object, _webSecurityMock.Object, _prototypeUowMock.Object, _httpContextBaseMock.Object);
            _prototypeUowMock.Setup(p => p.UserProfiles.GetByEmail(It.IsAny<string>()))
                             .Returns(new UserProfile {CompanyName = "testtest", Email = "test@test.com", FullName = "test"});
        }

        [TestMethod]
        public void PostLoginAuthenticated()
        {
            _webSecurityMock.Setup(m => m.Login(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<bool>())).Returns(true).Verifiable();
            var loginRequest = new LoginRequest{Email = "test@test.com", Password = "password", RememberMe = true};
            LoginResponse loginResult;
            using (ShimsContext.Create())
            {
                ShimFormsAuthentication.SetAuthCookieStringBoolean 
                    = (userName, createPersistenceCookie) 
                    => { };
                loginResult = _accountController.PostLogin(loginRequest);
            }
            Assert.AreEqual(true, loginResult.Successful);
            Assert.AreEqual("test", loginResult.DisplayName);
            Assert.IsNull(loginResult.ErrorMessage);
            _webSecurityMock.Verify(m => m.Login(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<bool>()), Times.Exactly(1));
        }

        [TestMethod]
        public void PostLoginNotAuthenticated()
        {
            _webSecurityMock.Setup(m => m.Login(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<bool>())).Returns(false);
            var loginModel = new LoginRequest{ Email = "test@test.com", Password = "password", RememberMe = true };
            LoginResponse loginResult;
            using (ShimsContext.Create())
            {
                ShimFormsAuthentication.SetAuthCookieStringBoolean
                    = (userName, createPersistenceCookie)
                    => { };
                loginResult = _accountController.PostLogin(loginModel);
            }
            Assert.AreEqual(false, loginResult.Successful);
            Assert.AreEqual("Please try again. Your username and password do not match.", loginResult.ErrorMessage);
            Assert.IsNull(loginResult.DisplayName);
            _webSecurityMock.Verify(m => m.Login(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<bool>()), Times.Exactly(1));
        }

        [TestMethod]
        public void GetLoginAuthenticated()
        {
            _webSecurityMock.Setup(m => m.IsAuthenticated()).Returns(true);
            _webSecurityMock.Setup(m => m.CurrentUserName()).Returns("test@test.com");
            LoginResponse loginResult = _accountController.GetLogin();
            Assert.AreEqual(true, loginResult.Successful);
            Assert.AreEqual("test", loginResult.DisplayName);
            _webSecurityMock.Verify(m => m.IsAuthenticated(), Times.Exactly(1));
        }

        [TestMethod]
        public void GetLoginNotAuthenticated()
        {
            _webSecurityMock.Setup(m => m.IsAuthenticated()).Returns(false);
            _webSecurityMock.Setup(m => m.CurrentUserName()).Returns("test@test.com");
            LoginResponse loginResult = _accountController.GetLogin();
            Assert.AreEqual(false, loginResult.Successful);
            Assert.IsNull(loginResult.DisplayName);
            _webSecurityMock.Verify(m => m.IsAuthenticated(), Times.Exactly(1));
        }

        [TestMethod]
        public void PostRegisterSuccessfully()
        {
            _webSecurityMock.Setup(m => m.CreateUserAndAccount("test@test.com", "password")).Returns("").Verifiable(); ;
            _webSecurityMock.Setup(m => m.Login("test@test.com", "password", false)).Returns(true).Verifiable(); ;
            var registerRequest = new RegisterRequest {Email = "test@test.com", FullName = "Woo Hoo", Password = "password"};
            LoginResponse loginResult;
            using (ShimsContext.Create())
            {
                ShimFormsAuthentication.SetAuthCookieStringBoolean
                    = (userName, createPersistenceCookie)
                    => { };
                loginResult = _accountController.PostRegister(registerRequest);
            }
            Assert.AreEqual(true, loginResult.Successful);
            _webSecurityMock.Verify(m => m.CreateUserAndAccount("test@test.com", "password"), Times.Exactly(1));
            _webSecurityMock.Verify(m => m.Login("test@test.com", "password", false), Times.Exactly(1));
        }

        [TestMethod]
        public void PostRegisterUnSuccessfully()
        {
            _webSecurityMock.Setup(m => m.CreateUserAndAccount("test@test.com", "password"))
                            .Throws<MembershipCreateUserException>().Verifiable();
            _webSecurityMock.Setup(m => m.Login("test@test.com", "password", false)).Returns(true);
            var registerModel = new RegisterRequest{ Email = "test@test.com", FullName = "Woo Hoo", Password = "password" };
            LoginResponse loginResult;
            using (ShimsContext.Create())
            {
                ShimFormsAuthentication.SetAuthCookieStringBoolean
                    = (userName, createPersistenceCookie)
                    => { };
                loginResult = _accountController.PostRegister(registerModel);
            }
            Assert.AreEqual(false, loginResult.Successful);
            _webSecurityMock.Verify(m => m.CreateUserAndAccount("test@test.com", "password"), Times.Exactly(1));
            _webSecurityMock.Verify(m => m.Login("test@test.com", "password", false), Times.Exactly(0));
        }

        [TestMethod]
        public void LogoutSuccessfully()
        {
            _webSecurityMock.Setup(m => m.Logout()).Verifiable();
            _accountController.PostSignOut();
            _webSecurityMock.Verify(m => m.Logout(), Times.Exactly(1));
        }

        [TestMethod]
        public void GetCookieSuccessfulIfTedCookieIsNotAvailable()
        {
            var httpRequestMock = new Mock<HttpRequestBase>();
            var httpResponseMock = new Mock<HttpResponseBase>();
            var httpCookies = new HttpCookieCollection();
            httpRequestMock.Setup(p => p.Cookies).Returns(httpCookies);
            httpRequestMock.Setup(p => p.UserHostAddress).Returns("127.0.0.1");
            httpResponseMock.Setup(p => p.Cookies).Returns(httpCookies);
            _httpContextBaseMock.Setup(p => p.Response).Returns(httpResponseMock.Object).Verifiable();
            _httpContextBaseMock.Setup(p => p.Request).Returns(httpRequestMock.Object).Verifiable();
            var sessionRepositoryMock = new Mock<ISessionRepository>();
            sessionRepositoryMock.Setup(p => p.GetByUniqueNumber(It.IsAny<string>()))
                                 .Returns((Session) null);
            sessionRepositoryMock.Setup(p => p.Add(It.IsAny<Session>())).Verifiable();
            _prototypeUowMock.SetupGet(p => p.Sessions).Returns(sessionRepositoryMock.Object);
            var response = _accountController.PostCookie(new CookieRequest());
            Assert.IsNotNull(httpCookies.Get("ted").Value);
            sessionRepositoryMock.Verify(p => p.Add(It.IsAny<Session>()), Times.Once());
        }

        [TestMethod]
        public void GetCookieSuccessfulIfTedCookieIsAvailable()
        {
            var httpRequestMock = new Mock<HttpRequestBase>();
            var httpResponseMock = new Mock<HttpResponseBase>();
            var httpCookies = new HttpCookieCollection();
            httpCookies.Add(new HttpCookie("ted","test"));
            httpRequestMock.Setup(p => p.Cookies).Returns(httpCookies);
            httpRequestMock.Setup(p => p.UserHostAddress).Returns("127.0.0.1");
            httpResponseMock.Setup(p => p.Cookies).Returns(httpCookies);
            _httpContextBaseMock.Setup(p => p.Response).Returns(httpResponseMock.Object).Verifiable();
            _httpContextBaseMock.Setup(p => p.Request).Returns(httpRequestMock.Object).Verifiable();
            var sessionRepositoryMock = new Mock<ISessionRepository>();
            sessionRepositoryMock.Setup(p => p.GetByUniqueNumber(It.IsAny<string>()))
                                 .Returns(new Session
                                              {
                                                  IPAddress = "127.0.0.1",
                                                  UniqueNumber = "test"
                                              });
            sessionRepositoryMock.Setup(p => p.Add(It.IsAny<Session>())).Verifiable();
            _prototypeUowMock.SetupGet(p => p.Sessions).Returns(sessionRepositoryMock.Object);
            var response = _accountController.PostCookie(new CookieRequest());
            Assert.IsNotNull(httpCookies.Get("ted").Value);
            sessionRepositoryMock.Verify(p => p.Add(It.IsAny<Session>()), Times.Never());
        }
    }
}
