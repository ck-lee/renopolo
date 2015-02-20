using System.Linq;

namespace CKS.Contracts
{
    public interface IRepository<T> where T : class
    {
        IQueryable<T> GetAll();
        T GetById(long id);
        void Add(T entity);
        void InsertOrUpdate(T entity);
        void Update(T entity);
        void Delete(T entity);
        void Delete(long id);
    }
}
