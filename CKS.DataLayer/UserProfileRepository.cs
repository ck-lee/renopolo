using System.Data.Entity;
using System.Linq;
using CKS.Contracts;
using CKS.Entities;

namespace CKS.DataLayer
{
    public class UserProfileRepository: EntityRepository<UserProfile>, IUserProfileRepository
    {
        public UserProfileRepository(DbContext context) : base(context) { }


        public UserProfile GetByEmail(string email)
        {
            return DbSet.FirstOrDefault(u => u.Email == email);
        }

    }
}
