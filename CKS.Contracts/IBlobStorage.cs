using System;

namespace CKS.Contracts
{
    public interface IBlobStorage
    {
        void Put(Byte[] content, string fileName);
        string GetUrl(string fileName);
    }
}
