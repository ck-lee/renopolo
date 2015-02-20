using System.Data.Entity.ModelConfiguration;
using CKS.Entities;

namespace CKS.DataLayer.Configuration
{
    public class SectionConfig : EntityTypeConfiguration<Section>
    {
        public SectionConfig()
        {
            Property(t => t.Name)
                .HasMaxLength(64);

            Property(t => t.TraceType)
                .HasMaxLength(64);
            
            Property(t => t.FloorPlanUrl)
                .HasMaxLength(128);

            HasOptional(t => t.Project)
                .WithMany(t => t.Sections);

            HasOptional(t => t.Session)
                .WithMany(t => t.Sections);
        }
    }
}
