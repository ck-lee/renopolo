using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CKS.Contracts;

namespace CKS.DiagnosticsWrapper
{
    public class Logger : ILogger
    {
        public Logger()
        {
            
        }

        public void Error(string message)
        {
            System.Diagnostics.Trace.TraceError(message);
        }

        public void ErrorException(string message, Exception excpetion)
        {
            System.Diagnostics.Trace.TraceError("Message:{0},Exception:{1}", message, excpetion);
        }

        public void Info(string message)
        {
            System.Diagnostics.Trace.TraceInformation(message);
        }

        public void InfoException(string message, Exception excpetion)
        {
            System.Diagnostics.Trace.TraceInformation("Message:{0},Exception:{1}", message, excpetion);
        }
    }
}
