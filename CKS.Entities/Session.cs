using System.Collections.Generic;

namespace CKS.Entities
{
    public class Session: BaseEntity
    {
        public string UniqueNumber { get; set; }
        public string IPAddress { get; set; }
        public string Country { get; set; }
        public virtual ICollection<Section> Sections { get; set; }
    }
}
