using System.Data.Entity.ModelConfiguration;
using CKS.Entities;

namespace CKS.DataLayer.Configuration
{
    public class AdjustmentConfig : EntityTypeConfiguration<Adjustment>
    {
        public AdjustmentConfig()
        {
            Property(t => t.AdjustmentName)
                .IsRequired()
                .HasMaxLength(64);

            Property(t => t.AdjustmentType)
                .HasMaxLength(64);

            HasRequired(t => t.Section)
                .WithMany(t => t.Adjustments);

        }
    }
}