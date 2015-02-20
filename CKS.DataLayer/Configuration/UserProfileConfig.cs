using System.Data.Entity.ModelConfiguration;
using CKS.Entities;

namespace CKS.DataLayer.Configuration
{
    public class UserProfileConfig : EntityTypeConfiguration<UserProfile>
    {
        public UserProfileConfig()
        {
   
            Property(t => t.Email)
                .IsRequired()
                .HasMaxLength(64);

            Property(t => t.FullName)
                .HasMaxLength(64);

            Property(t => t.CompanyName)
                .HasMaxLength(64);
        }
    }
}
