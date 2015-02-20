using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using CKS.Contracts;
using System.Net.Http;

namespace CKS.Prototype.Wrappers
{
    [ExcludeFromCodeCoverage]
    public class ApiRequestWrapper: IApiRequest
    {
        public bool IsMimeMultipartContent(HttpContent httpContent)
        {
            return httpContent.IsMimeMultipartContent();
        }

        public Task<MultipartMemoryStreamProvider> ReadAsMultipartAsync(HttpContent httpContent, MultipartMemoryStreamProvider provider)
        {
            return httpContent.ReadAsMultipartAsync(provider);
        }
    }
}