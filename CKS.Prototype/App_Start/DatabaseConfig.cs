using System.Diagnostics.CodeAnalysis;
using CKS.Contracts;
using CKS.DataLayer;

namespace CKS.Prototype
{
    [ExcludeFromCodeCoverage]
    public static class DatabaseConfig
    {
        public static void InitializeDatabase(ILogger logger)
        {
            using (var prototypeContext = new PrototypeContext())
            {
                //Use EF Migration
                //if (!prototypeContext.Database.Exists())
                //{
                //    prototypeContext.Database.Create();
                //}
                prototypeContext.Database.Initialize(false);
            }
        }
    }
}