using System;
using System.Collections.Generic;

namespace CKS.Entities
{
    public class UserProfile: BaseEntity
    {
        public string Email { get; set; }
        public string FullName { get; set; }
        public string CompanyName { get; set; }
        
        public virtual ICollection<Project> Projects { get; set; }
    }
}
