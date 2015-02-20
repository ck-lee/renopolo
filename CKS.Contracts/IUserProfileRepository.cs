using CKS.Entities;

namespace CKS.Contracts
{
    public interface IUserProfileRepository
    {
        UserProfile GetByEmail(string email);
    }
}
