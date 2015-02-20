using System.Collections.Generic;
using Newtonsoft.Json;

namespace CKS.Entities
{
    public class Project: BaseEntity
    {
        public string Title { get; set; }
        public string SystemOfMeasurement { get; set; }
        [JsonIgnore]
        public virtual UserProfile UserProfile { get; set; }
        public virtual ICollection<Section> Sections { get; set; }
        public virtual ICollection<TypeOfWork> TypesOfWork { get; set; }
    }
}
