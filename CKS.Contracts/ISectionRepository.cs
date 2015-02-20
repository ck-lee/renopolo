using System.Collections.Generic;
using System.Linq;
using CKS.Entities;

namespace CKS.Contracts
{
    public interface ISectionRepository
    {
        IQueryable<Section> GetAll();
        Section GetById(long id);
        void Add(Section entity);
        void InsertOrUpdate(Section entity);
        void Update(Section entity);
        void Delete(Section entity);
        void Delete(long id);
        void AttachWalls(Section entity, ICollection<Wall> walls);
        void AttachAdjustments(Section section, ICollection<Adjustment> adjustments);
    }
}
