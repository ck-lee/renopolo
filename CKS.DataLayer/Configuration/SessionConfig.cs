using System.Data.Entity.ModelConfiguration;
using CKS.Entities;

namespace CKS.DataLayer.Configuration
{
    public class SessionConfig : EntityTypeConfiguration<Session>
    {
        public SessionConfig()
        {
            
            Property(t => t.UniqueNumber)
                .HasMaxLength(64);

            Property(t => t.IPAddress)
                .IsRequired()
                .HasMaxLength(64);

            Property(t => t.Country)
                .HasMaxLength(64);
        }
    }
}
