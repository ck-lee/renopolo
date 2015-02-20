using System;
using System.Data.Entity;
using CKS.Entities;

namespace CKS.Contracts
{
    public interface IRepositoryProvider
    {

        DbContext DbContext { get; set; }

        IRepository<T> GetRepositoryForEntityType<T>() where T : BaseEntity;
        T GetRepository<T>(Func<DbContext, object> factory = null) where T : class;
        void SetRepository<T>(T repository);
    }
}
