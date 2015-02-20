namespace CKS.Contracts
{
    public interface IWebSecurity
    {
        bool Login(string userName, string password, bool rememberMe);
        bool IsAuthenticated();
        string CurrentUserName();
        string CreateUserAndAccount(string userName, string password);
        void Logout();
    }
}
