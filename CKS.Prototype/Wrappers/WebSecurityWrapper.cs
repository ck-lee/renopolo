using System.Diagnostics.CodeAnalysis;
using CKS.Contracts;
using WebMatrix.WebData;

namespace CKS.Prototype.Wrappers
{
    [ExcludeFromCodeCoverage]
    public class WebSecurityWrapper : IWebSecurity
    {
        public bool Login(string userName, string password, bool rememberMe)
        {
            return WebSecurity.Login(userName, password, rememberMe);
        }

        public bool IsAuthenticated()
        {
            return WebSecurity.IsAuthenticated;
        }

        public string CurrentUserName()
        {
            return WebSecurity.CurrentUserName;
        }

        public string CreateUserAndAccount(string userName, string password)
        {
            return WebSecurity.CreateUserAndAccount(userName, password);
        }

        public void Logout()
        {
            WebSecurity.Logout();
        }
    }
}