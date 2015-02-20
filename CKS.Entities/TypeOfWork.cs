using Newtonsoft.Json;

namespace CKS.Entities
{
    public class TypeOfWork: BaseEntity
    {
        public string Name { get; set; }
        [JsonIgnore]
        public virtual Project Project { get; set; }
    }
}
