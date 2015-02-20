using System;
using System.Collections.ObjectModel;
using CKS.Entities;

namespace CKS.Prototype.Tests
{
    public static class ObjectMother
    {
        public static Wall Wall
        {
            get
            {
                return new Wall
                           {
                               StartPointX = 1,
                               StartPointY = 2,
                               EndPointX = 3,
                               EndPointY = 4,
                               Height = 10,
                               Length = 10
                           };
            }
        }

        public static Adjustment Adjustment
        {
            get
            {
                return new Adjustment()
                {
                    Id = 102,
                    AdjustmentName = "Windows",
                    AdjustmentType = "Internal",
                    Size = 100,
                    Quantity = 2,
                    Total = 200
                };
            }
        }

        public static Section Section
        {
            get
            {
                return new Section()
                           {
                               Id = 100,
                               Name = "SectionName",
                               Walls = new Collection<Wall>(new[] {Wall}),
                               Adjustments = new Collection<Adjustment>(new[] {Adjustment})
                           };
            }
        }

        public static Project Project
        {
            get
            {
                return new Project()
                           {
                               Title = "ProjectTitle",
                               SystemOfMeasurement = "Metric",
                               Id = 1234,
                               Sections = new Collection<Section>(new[] {Section}),
                               CreatedDate = new DateTime(2013,7,14)
                               
                           };
            }
        }

        public static Collection<Project> Projects
        {
            get
            {
                return new Collection<Project>(new[]
                                                   {
                                                       Project
                                                   });
            }
        }

        public static UserProfile UserProfile
        {
            get
            {
                return new UserProfile
                           {
                               CompanyName = "Company",
                               Email = "test@test.com",
                               FullName = "CK Lee",
                               Projects = Projects
                           };
            }
        }
    }
}
