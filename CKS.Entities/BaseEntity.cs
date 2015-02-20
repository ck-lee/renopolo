using System;

namespace CKS.Entities
{
    public abstract class BaseEntity
    {
        public long? Id { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? LastModifiedDate { get; set; }
    }
}
