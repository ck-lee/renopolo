using System.Net.Http;
using System.Threading.Tasks;

namespace CKS.Contracts
{
    public interface IApiRequest
    {
        bool IsMimeMultipartContent(HttpContent httpContent);
        Task<MultipartMemoryStreamProvider> ReadAsMultipartAsync(HttpContent httpContent, MultipartMemoryStreamProvider provider);
    }
}