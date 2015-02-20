using System;
using CKS.Contracts;
using NLog;

namespace CKS.NLogWrapper
{
    public class Logger : ILogger
    {
        private readonly NLog.Logger _logger;
        public Logger(string name)
        {
            _logger = LogManager.GetLogger(name);
        }

        public void Error(string message)
        {
            _logger.Error(message);
        }

        public void ErrorException(string message, Exception excpetion)
        {
            _logger.ErrorException(message, excpetion);
        }

        public void Info(string message)
        {
            _logger.Info(message);
        }

        public void InfoException(string message, Exception excpetion)
        {
            _logger.InfoException(message, excpetion);
        }
    }
}
