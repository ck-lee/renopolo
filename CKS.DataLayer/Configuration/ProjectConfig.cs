using System.Data.Entity.ModelConfiguration;
using CKS.Entities;

namespace CKS.DataLayer.Configuration
{
    public class ProjectConfig : EntityTypeConfiguration<Project>
    {
        public ProjectConfig()
        {
            Property(t => t.Title)
                .IsRequired()
                .HasMaxLength(64);

            Property(t => t.SystemOfMeasurement)
                .HasMaxLength(64);

            HasRequired(t => t.UserProfile)
                .WithMany(t => t.Projects);

            HasMany(t => t.TypesOfWork)
                .WithRequired(t => t.Project);

        }
    }
}