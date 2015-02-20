using System.Data.Entity.ModelConfiguration;
using CKS.Entities;

namespace CKS.DataLayer.Configuration
{
    public class TypeOfWorkConfig : EntityTypeConfiguration<TypeOfWork>
    {
        public TypeOfWorkConfig()
        {
            Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(64);

        }
    }
}
