using System.Data.Entity.ModelConfiguration;
using CKS.Entities;

namespace CKS.DataLayer.Configuration
{
    public class WallConfig: EntityTypeConfiguration<Wall>
    {
        public WallConfig()
        {
            HasRequired(t => t.Section)
                .WithMany(t => t.Walls);
        }
    }
}
