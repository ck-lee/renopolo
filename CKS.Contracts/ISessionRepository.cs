using System.Linq;
using CKS.Entities;

namespace CKS.Contracts
{
    public interface ISessionRepository
    {

        IQueryable<Session> GetAll();
        Session GetById(long id);
        void Add(Session entity);
        void InsertOrUpdate(Session entity);
        void Update(Session entity);
        void Delete(Session entity);
        void Delete(long id);
        Session GetByUniqueNumber(string uniqueNumber);
    }
}
