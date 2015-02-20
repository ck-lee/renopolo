using System.Data.Entity;
using System.Linq;
using CKS.Contracts;
using CKS.Entities;

namespace CKS.DataLayer
{
    public class SessionRepository : EntityRepository<Session>, ISessionRepository
    {
        public SessionRepository(DbContext context) : base(context)
        {
        }

        public Session GetByUniqueNumber(string uniqueNumber)
        {
            return DbSet.FirstOrDefault(u => u.UniqueNumber == uniqueNumber);
        }
    }
}
