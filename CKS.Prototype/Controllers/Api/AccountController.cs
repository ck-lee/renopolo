using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using CKS.Contracts;
using CKS.Entities;
using CKS.Prototype.Filters;
using CKS.ViewModels.Account;

namespace CKS.Prototype.Controllers.Api
{
    [InitializeSimpleMembership]
    public class AccountController : ApiController
    {
        private readonly IWebSecurity _webSecurity;
        private readonly ILogger _logger;
        private readonly IPrototypeUow _prototypeUow;
        private readonly HttpContextBase _context;
        private const string PasswordDoNotMatch = "Please try again. Your username and password do not match.";
        private const string UsernameIsInUse = "Please enter another e-mail to register. {0} is already in use.";
        private const string EmailNotFound = "Not able to find UserProfile with the email {0}";
        
        public AccountController(ILogger logger, IWebSecurity webSecurity, IPrototypeUow prototypeUow, HttpContextBase context)
        {
            _logger = logger;
            _webSecurity = webSecurity;
            _prototypeUow = prototypeUow;
            _context = context;
        }

        [AllowAnonymous]
        [ActionName("Login")]
        public LoginResponse PostLogin(LoginRequest loginRequest)
        {
            if (loginRequest == null)
                throw new ArgumentNullException("loginRequest");
            return Login(loginRequest.Email, loginRequest.Password, loginRequest.RememberMe);
        }

        [AllowAnonymous]
        [ActionName("Login")]
        public LoginResponse GetLogin()
        {
            if (_webSecurity.IsAuthenticated())
            {
                var successfulLoginResult = new LoginResponse
                                                {
                                                    Successful = true, 
                                                    DisplayName = GetFullName(_webSecurity.CurrentUserName())
                                                };
                return successfulLoginResult;
            }
            var failedLoginResult = new LoginResponse { Successful = false };
            return failedLoginResult;
        }

        
        [ActionName("Register")]
        public LoginResponse PostRegister(RegisterRequest registerRequest)
        {
            if (registerRequest == null) throw new ArgumentNullException("registerRequest");
            try
            {
                _webSecurity.CreateUserAndAccount(registerRequest.Email, registerRequest.Password);
                SaveUserProfileToDatabase(registerRequest.Email, registerRequest.FullName, registerRequest.CompanyName);
                return Login(registerRequest.Email, registerRequest.Password, false);
            }
            catch (MembershipCreateUserException e)
            {
                _logger.ErrorException("PostRegister() has error", e);
                return new LoginResponse
                {
                    Successful = false,
                    ErrorMessage = UsernameIsInUse
                };
            }
        }

        [Authorize]
        [ActionName("SignOut")]
        public HttpResponseMessage PostSignOut()
        {
            _webSecurity.Logout();
            return new HttpResponseMessage(HttpStatusCode.OK);
        }


        [ActionName("Cookie")]
        public HttpResponseMessage PostCookie(CookieRequest cookieRequest)
        {
            var httpCookie = _context.Request.Cookies.Get("ted");
            if (httpCookie == null)
            {
                var cookie = new HttpCookie("ted", GetUniqueNumber());
                _context.Response.Cookies.Add(cookie);
                var session = new Session
                {
                    UniqueNumber = cookie.Value,
                    IPAddress = _context.Request.UserHostAddress,
                    Country = cookieRequest.Country
                };
                _prototypeUow.Sessions.Add(session);
                _prototypeUow.Commit();

            }
            else
            {
                var session = _prototypeUow.Sessions.GetByUniqueNumber(httpCookie.Value);
                session.IPAddress = _context.Request.UserHostAddress;
                session.LastModifiedDate = DateTime.Now;
                _prototypeUow.Commit();
            }
            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        private LoginResponse Login(string email, string password, bool rememberMe)
        {
            try
            {
                if (_webSecurity.Login(email, password, rememberMe))
                {
                    FormsAuthentication.SetAuthCookie(email, false);
                    var successfulLoginResult = new LoginResponse
                                                    {
                                                        Successful = true, 
                                                        DisplayName = GetFullName(email)
                                                    };
                    return successfulLoginResult;
                }
                return new LoginResponse { Successful = false, ErrorMessage = PasswordDoNotMatch };
            }
            catch (MembershipPasswordException e)
            {
                return new LoginResponse
                {
                    Successful = false,
                    ErrorMessage = PasswordDoNotMatch
                };
            }
            catch (MembershipCreateUserException e)
            {
                return new LoginResponse
                {
                    Successful = false,
                    ErrorMessage = PasswordDoNotMatch
                };
            }
        }

        private void SaveUserProfileToDatabase(string email, string fullName, string companyName)
        {
            var userProfile = _prototypeUow.UserProfiles.GetByEmail(email);
            if (userProfile != null)
            {
                userProfile.FullName = fullName;
                userProfile.CompanyName = companyName;
                userProfile.CreatedDate = DateTime.Now;
                userProfile.LastModifiedDate = DateTime.Now;
                _prototypeUow.Commit();
            }
            else
            {
                throw new InvalidOperationException(String.Format(CultureInfo.InvariantCulture,
                                                                        "Not able to find UserProfile with the email {0}",
                                                                        email));
            }    
        }          

        private string GetFullName(string email)
        {
            var userProfile = _prototypeUow.UserProfiles.GetByEmail(email);
            if (userProfile != null)
            {
                return userProfile.FullName;
            }
            throw new InvalidOperationException(String.Format(CultureInfo.InvariantCulture, EmailNotFound, email));
        }

        private static string GetUniqueNumber()
        {
            string randomNumber = RandomString(10);
            return randomNumber;
        }

        private static string RandomString(int length, string allowedChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
        {
            if (length < 0) throw new ArgumentOutOfRangeException("length", "length cannot be less than zero.");
            if (string.IsNullOrEmpty(allowedChars)) throw new ArgumentException("allowedChars may not be empty.");

            const int byteSize = 0x100;
            var allowedCharSet = new HashSet<char>(allowedChars).ToArray();
            if (byteSize < allowedCharSet.Length) throw new ArgumentException(String.Format("allowedChars may contain no more than {0} characters.", byteSize));

            // Guid.NewGuid and System.Random are not particularly random. By using a
            // cryptographically-secure random number generator, the caller is always
            // protected, regardless of use.
            using (var rng = new System.Security.Cryptography.RNGCryptoServiceProvider())
            {
                var result = new StringBuilder();
                var buf = new byte[128];
                while (result.Length < length)
                {
                    rng.GetBytes(buf);
                    for (var i = 0; i < buf.Length && result.Length < length; ++i)
                    {
                        // Divide the byte into allowedCharSet-sized groups. If the
                        // random value falls into the last group and the last group is
                        // too small to choose from the entire allowedCharSet, ignore
                        // the value in order to avoid biasing the result.
                        var outOfRangeStart = byteSize - (byteSize % allowedCharSet.Length);
                        if (outOfRangeStart <= buf[i]) continue;
                        result.Append(allowedCharSet[buf[i] % allowedCharSet.Length]);
                    }
                }
                return result.ToString();
            }
        }
    }
}
