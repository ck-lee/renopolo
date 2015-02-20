using System;
using System.Collections.Generic;
using System.Data.Entity;
using CKS.Contracts;
using CKS.Entities;

namespace CKS.DataLayer.Helpers
{
    public class RepositoryFactories
    {
        public RepositoryFactories()  
        {
            _repositoryFactories = GetPrototypeFactories();
        }

        //public RepositoryFactories(IDictionary<Type, Func<DbContext, object>> factories )
        //{
        //    _repositoryFactories = factories;
        //}

        public Func<DbContext, object> GetRepositoryFactory<T>()
        {
       
            Func<DbContext, object> factory;
            _repositoryFactories.TryGetValue(typeof(T), out factory);
            return factory;
        }

        public Func<DbContext, object> GetRepositoryFactoryForEntityType<T>() where T : BaseEntity
        {
            return GetRepositoryFactory<T>() ?? DefaultEntityRepositoryFactory<T>();
        }

        protected virtual Func<DbContext, object> DefaultEntityRepositoryFactory<T>() where T : BaseEntity
        {
            return dbContext => new EntityRepository<T>(dbContext);
        }

        
        private IDictionary<Type, Func<DbContext, object>> GetPrototypeFactories()
        {
            return new Dictionary<Type, Func<DbContext, object>>
                       {
                           {typeof(IUserProfileRepository), dbContext => new UserProfileRepository(dbContext)},
                           {typeof(ISessionRepository), dbContext => new SessionRepository(dbContext)},
                           {typeof(ISectionRepository), dbContext => new SectionRepository(dbContext)},
                       };
        }


        private readonly IDictionary<Type, Func<DbContext, object>> _repositoryFactories;

    }
}
