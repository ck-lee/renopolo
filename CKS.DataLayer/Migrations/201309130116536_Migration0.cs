namespace CKS.DataLayer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Migration0 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.UserProfile",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Email = c.String(nullable: false, maxLength: 64),
                        FullName = c.String(maxLength: 64),
                        CompanyName = c.String(maxLength: 64),
                        CreatedDate = c.DateTime(),
                        LastModifiedDate = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Project",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Title = c.String(nullable: false, maxLength: 64),
                        SystemOfMeasurement = c.String(maxLength: 64),
                        CreatedDate = c.DateTime(),
                        LastModifiedDate = c.DateTime(),
                        UserProfile_Id = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.UserProfile", t => t.UserProfile_Id, cascadeDelete: true)
                .Index(t => t.UserProfile_Id);
            
            CreateTable(
                "dbo.Section",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(maxLength: 64),
                        FloorPlanUrl = c.String(maxLength: 128),
                        TraceType = c.String(maxLength: 64),
                        CreatedDate = c.DateTime(),
                        LastModifiedDate = c.DateTime(),
                        Project_Id = c.Long(),
                        Session_Id = c.Long(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Project", t => t.Project_Id)
                .ForeignKey("dbo.Session", t => t.Session_Id)
                .Index(t => t.Project_Id)
                .Index(t => t.Session_Id);
            
            CreateTable(
                "dbo.Session",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        UniqueNumber = c.String(maxLength: 64),
                        IPAddress = c.String(nullable: false, maxLength: 64),
                        Country = c.String(maxLength: 64),
                        CreatedDate = c.DateTime(),
                        LastModifiedDate = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Wall",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        WallIndex = c.Int(),
                        StartPointX = c.Int(),
                        StartPointY = c.Int(),
                        EndPointX = c.Int(),
                        EndPointY = c.Int(),
                        Length = c.Single(),
                        Height = c.Single(),
                        WallType = c.String(),
                        CreatedDate = c.DateTime(),
                        LastModifiedDate = c.DateTime(),
                        Section_Id = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Section", t => t.Section_Id, cascadeDelete: true)
                .Index(t => t.Section_Id);
            
            CreateTable(
                "dbo.Adjustment",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        AdjustmentType = c.String(maxLength: 64),
                        AdjustmentName = c.String(nullable: false, maxLength: 64),
                        Quantity = c.Int(),
                        Size = c.Single(),
                        Total = c.Single(),
                        CreatedDate = c.DateTime(),
                        LastModifiedDate = c.DateTime(),
                        Section_Id = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Section", t => t.Section_Id, cascadeDelete: true)
                .Index(t => t.Section_Id);
            
            CreateTable(
                "dbo.TypeOfWork",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 64),
                        CreatedDate = c.DateTime(),
                        LastModifiedDate = c.DateTime(),
                        Project_Id = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Project", t => t.Project_Id, cascadeDelete: true)
                .Index(t => t.Project_Id);
            
        }
        
        public override void Down()
        {
            DropIndex("dbo.TypeOfWork", new[] { "Project_Id" });
            DropIndex("dbo.Adjustment", new[] { "Section_Id" });
            DropIndex("dbo.Wall", new[] { "Section_Id" });
            DropIndex("dbo.Section", new[] { "Session_Id" });
            DropIndex("dbo.Section", new[] { "Project_Id" });
            DropIndex("dbo.Project", new[] { "UserProfile_Id" });
            DropForeignKey("dbo.TypeOfWork", "Project_Id", "dbo.Project");
            DropForeignKey("dbo.Adjustment", "Section_Id", "dbo.Section");
            DropForeignKey("dbo.Wall", "Section_Id", "dbo.Section");
            DropForeignKey("dbo.Section", "Session_Id", "dbo.Session");
            DropForeignKey("dbo.Section", "Project_Id", "dbo.Project");
            DropForeignKey("dbo.Project", "UserProfile_Id", "dbo.UserProfile");
            DropTable("dbo.TypeOfWork");
            DropTable("dbo.Adjustment");
            DropTable("dbo.Wall");
            DropTable("dbo.Session");
            DropTable("dbo.Section");
            DropTable("dbo.Project");
            DropTable("dbo.UserProfile");
        }
    }
}
