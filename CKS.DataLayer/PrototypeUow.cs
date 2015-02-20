using System;
using System.Data.Entity.Validation;
using System.Globalization;
using CKS.Contracts;
using CKS.Entities;

namespace CKS.DataLayer
{
    public class PrototypeUow: IPrototypeUow, IDisposable
    {
        private readonly ILogger _logger;
        public PrototypeUow(IRepositoryProvider repositoryProvider, ILogger logger)
        {
            if (repositoryProvider == null)
            {
                throw new ArgumentNullException("repositoryProvider");
            }
            CreateDbContext();
            repositoryProvider.DbContext = DbContext;
            RepositoryProvider = repositoryProvider;
            _logger = logger;
        }

        public IRepository<Project> Projects { get { return GetStandardRepo<Project>(); } }
        public ISectionRepository Sections { get { return GetRepo<ISectionRepository>(); } }
        public IRepository<TypeOfWork> TypeOfWorks { get { return GetStandardRepo<TypeOfWork>(); } }
        public IUserProfileRepository UserProfiles { get { return GetRepo<IUserProfileRepository>(); } }
        public IRepository<Wall> Walls { get { return GetStandardRepo<Wall>(); } }
        public ISessionRepository Sessions { get { return GetRepo<ISessionRepository>(); } }
        public IRepository<Adjustment> Adjustments { get { return GetStandardRepo<Adjustment>(); } }

        public void Commit()
        {
            try
            {
                DbContext.SaveChanges();
            }
            catch (DbEntityValidationException e)
            {
                foreach (var validationErrors in e.EntityValidationErrors)
                {
                    foreach (var validationError in validationErrors.ValidationErrors)
                    {
                        _logger.ErrorException(string.Format(CultureInfo.InvariantCulture, "Property: {0} Error: {1}", validationError.PropertyName, validationError.ErrorMessage), e);
                    }
                }
                throw;
            }
        }

        protected void CreateDbContext()
        {
            DbContext = new PrototypeContext();

            // Do NOT enable proxied entities, else serialization fails
            //DbContext.Configuration.ProxyCreationEnabled = false;

            // Load navigation properties explicitly (avoid serialization trouble)
            //DbContext.Configuration.LazyLoadingEnabled = false;

            // Because Web API will perform validation, we don't need/want EF to do so
            //DbContext.Configuration.ValidateOnSaveEnabled = false;

            //DbContext.Configuration.AutoDetectChangesEnabled = false;
        }

        protected IRepositoryProvider RepositoryProvider { get; set; }

        private IRepository<T> GetStandardRepo<T>() where T : BaseEntity
        {
            return RepositoryProvider.GetRepositoryForEntityType<T>();
        }
        private T GetRepo<T>() where T : class
        {
            return RepositoryProvider.GetRepository<T>();
        }

        private PrototypeContext DbContext { get; set; }

        #region IDisposable

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (DbContext != null)
                {
                    DbContext.Dispose();
                }
            }
        }

        #endregion
    }
}
