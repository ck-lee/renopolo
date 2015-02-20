using System;

namespace CKS.Contracts
{
    public interface ILogger
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1716:IdentifiersShouldNotMatchKeywords", MessageId = "Error")]
        void Error(string message);
        void ErrorException(string message, Exception exception);
        void Info(string message);
        void InfoException(string message, Exception exception);
    }
}