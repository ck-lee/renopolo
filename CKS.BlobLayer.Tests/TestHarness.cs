using System;
using CKS.Contracts;
using Moq;
using System.IO;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace CKS.BlobLayer.Tests
{
    [TestClass]
    public class TestHarness
    {
        [TestMethod]
        public void TestPut()
        {
            var logger = new Mock<ILogger>().Object;
            var azureBlobStorage = new AzureBlobStorage(logger);
            string assemblyPath = Directory.GetCurrentDirectory();
            byte[] bytes = System.IO.File.ReadAllBytes(assemblyPath + "\\..\\..\\PlanBackground.png");
            azureBlobStorage.Put(bytes, "PlanBackground.png");
           
        }
    }
}
