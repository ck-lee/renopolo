using CKS.Entities;

namespace CKS.Contracts
{
    public interface IPrototypeUow
    {
        void Commit();

        // Repositories
        IRepository<Project> Projects { get; }
        ISectionRepository Sections { get; }
        IRepository<TypeOfWork> TypeOfWorks { get; }
        IUserProfileRepository UserProfiles { get; }
        IRepository<Wall> Walls { get; }
        ISessionRepository Sessions { get; }
        IRepository<Adjustment> Adjustments { get; } 
    }
}