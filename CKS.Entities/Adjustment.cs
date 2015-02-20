using Newtonsoft.Json;

namespace CKS.Entities
{
    public class Adjustment: BaseEntity
    {
        public string AdjustmentType { get; set; }
        public string AdjustmentName { get; set; }
        public int? Quantity { get; set; }
        public float? Size { get; set; }
        public float? Total { get; set; }
        [JsonIgnore]
        public virtual Section Section { get; set; }
    }
}
