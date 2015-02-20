using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Migrations;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Data.Objects;
using System.Linq;
using CKS.DataLayer.Configuration;
using CKS.Entities;

namespace CKS.DataLayer
{
    public class PrototypeContext : DbContext
    {
        static PrototypeContext()
        {
            //Use Disable Auto
            //Database.SetInitializer(new MigrateDatabaseToLatestVersion<PrototypeContext, Migrations.Configuration>());
            //var configuration = new Migrations.Configuration();
            //var migrator = new DbMigrator(configuration);
            //migrator.Update();
        }

        public PrototypeContext() : base("Name=PrototypeContext")
        {
        }

        public IDbSet<UserProfile> UserProfiles { get; set; }
        public IDbSet<Project> Projects { get; set; }
        public IDbSet<Section> Sections { get; set; }
        public IDbSet<TypeOfWork> TypeOfWorks { get; set; }
        public IDbSet<Wall> Walls { get; set; }
        public IDbSet<Session> Sessions { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            if (modelBuilder == null) throw new ArgumentNullException("modelBuilder");
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            modelBuilder.Configurations.Add(new ProjectConfig());
            modelBuilder.Configurations.Add(new SectionConfig());
            modelBuilder.Configurations.Add(new TypeOfWorkConfig());
            modelBuilder.Configurations.Add(new UserProfileConfig());
            modelBuilder.Configurations.Add(new WallConfig());
            modelBuilder.Configurations.Add(new SessionConfig());
            modelBuilder.Configurations.Add(new AdjustmentConfig());
        }
        public override int SaveChanges()
        {
            var context = ((IObjectContextAdapter) this).ObjectContext;

            //Find all Entities that are Added/Modified that inherit from my EntityBase
            IEnumerable<ObjectStateEntry> objectStateEntries =
                context.ObjectStateManager.GetObjectStateEntries(EntityState.Added | EntityState.Modified)
                        .Where(e => e.IsRelationship == false &&
                                    e.Entity != null &&
                                    typeof (BaseEntity).IsAssignableFrom(e.Entity.GetType()));

            var currentTime = DateTime.Now;

            foreach (var entry in objectStateEntries)
            {
                var baseEntity = entry.Entity as BaseEntity;

                if (entry.State == EntityState.Added)
                {
                    if (baseEntity != null) baseEntity.CreatedDate = currentTime;
                    if (baseEntity != null) baseEntity.LastModifiedDate = currentTime;
                }
                else if (entry.State == EntityState.Modified)
                {
                    if (baseEntity != null) baseEntity.LastModifiedDate = currentTime;
                    if (baseEntity != null) baseEntity.CreatedDate = entry.OriginalValues["CreatedDate"] as DateTime?;
                }                
            }

            return base.SaveChanges();
        }
    }
}
