using System.Collections.Generic;
using Newtonsoft.Json;

namespace CKS.Entities
{
    public class Section: BaseEntity
    {
        public string Name { get; set; }
        public string FloorPlanUrl { get; set; }
        public string TraceType { get; set; } 
        [JsonIgnore]
        public virtual Project Project { get; set; }
        [JsonIgnore] 
        public virtual Session Session { get; set; }
        public virtual ICollection<Wall> Walls { get; set; }
        public virtual ICollection<Adjustment> Adjustments { get; set; }
    }
}
