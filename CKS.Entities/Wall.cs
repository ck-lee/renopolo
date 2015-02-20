using Newtonsoft.Json;

namespace CKS.Entities
{
    public class Wall : BaseEntity
    {
        public int? WallIndex { get; set; }
        public int? StartPointX { get; set; }
        public int? StartPointY { get; set; }
        public int? EndPointX { get; set; }
        public int? EndPointY { get; set; }
        public float? Length { get; set; }
        public float? Height { get; set; }
        public string WallType { get; set; }
        
        [JsonIgnore]
        public virtual Section Section { get; set; }
    }
}
