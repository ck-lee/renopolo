using System;
using System.Configuration;
using System.Globalization;
using System.IO;
using CKS.Contracts;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace CKS.BlobLayer
{
    public class AzureBlobStorage : IBlobStorage
    {
        private readonly CloudBlobContainer _blockContainer;
        private readonly ILogger _logger;
        public AzureBlobStorage(ILogger logger)
        {
            _logger = logger;
            var storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["StorageConnectionString"].ToString());
            var blobClient = storageAccount.CreateCloudBlobClient();
            _blockContainer = blobClient.GetContainerReference("public");            
        }

        public void Put(byte[] content, string fileName)
        {
            try
            {
                using (var stream = new MemoryStream(content))
                {
                    var blockBlob =  _blockContainer.GetBlockBlobReference(fileName);
                    blockBlob.Properties.ContentType = "image/png";
                    blockBlob.UploadFromStream(stream);
                }
            }
            catch(Exception e)
            {
                _logger.ErrorException("Error in AzureBlobStorage.Put()", e);                
            }
        }

        public  string GetUrl(string fileName)
        {
            //TODO: Unhardcore this
            return String.Format(CultureInfo.InvariantCulture, "http://ted.blob.core.windows.net/public/{0}", fileName);
        }
    }
}
