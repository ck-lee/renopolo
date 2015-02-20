using System;
using System.Diagnostics;
using System.Globalization;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using CKS.Contracts;
using CKS.Entities;
using CKS.ViewModels.File;

namespace CKS.Prototype.Controllers.Api
{
    public class FileController : ApiController
    {
        private readonly ILogger _logger;
        private readonly IBlobStorage _blobStorage;
        private readonly IPrototypeUow _prototypeUow;
        private readonly HttpContextBase _context;
        private readonly IApiRequest _apiRequest;

        public FileController(ILogger logger, IBlobStorage blobStorage, IPrototypeUow prototypeUow, HttpContextBase httpContextBase, IApiRequest apiRequest)
        {
            _logger = logger;
            _blobStorage = blobStorage;
            _prototypeUow = prototypeUow;
            _context = httpContextBase;
            _apiRequest = apiRequest;
        }

        [ActionName("floorplan")]
        public async Task<PostFloorPlanResponse> PostFloorPlan()
        {
            var stopWatch = new Stopwatch();
            stopWatch.Start();
            // Check if the request contains multipart/form-data.
            if (!_apiRequest.IsMimeMultipartContent(Request.Content))
            {
                _logger.Error("FileController PostFloorPlan() has error. Request does not contain multipart/form-data");
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }
            var httpCookie = _context.Request.Cookies.Get("ted");
            string iPAddress = _context.Request.UserHostAddress;
            if (httpCookie == null)
            {
                _logger.Error("FileController PostFloorPlan() has error. Request header does not contain ted session key");
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            try
            { 
                var provider = await _apiRequest.ReadAsMultipartAsync(Request.Content, new MultipartMemoryStreamProvider());
                if (provider.Contents.Count != 2)
                    throw new HttpResponseException(HttpStatusCode.BadRequest);
                var sectionIdHttpContent = provider.Contents[0];
                var requestSectionIdString = await sectionIdHttpContent.ReadAsStringAsync();
                long? requestSectionId = TryParseNullable(requestSectionIdString);
                var httpContent = provider.Contents[1];
                if (httpContent == null) 
                    throw new HttpResponseException(HttpStatusCode.NoContent);
                var fileName = httpContent.Headers.ContentDisposition.FileName.Replace("\"", string.Empty);
                var response = new PostFloorPlanResponse();
                await Task.Factory.StartNew(() =>
                                          {
                                              var sectionId = UpdateDatabase(httpCookie.Value, iPAddress, null, GetBlobFileName(fileName), requestSectionId);
                                              response = GetResult(httpContent.Headers, fileName, sectionId);
                                          });
                await httpContent.ReadAsByteArrayAsync().ContinueWith(task => UploadBlob(task.Result, GetBlobFileName(fileName)));
                stopWatch.Stop();
                _logger.Info(String.Format(CultureInfo.InvariantCulture, "FileController PostFloorPlan() Total elapsed time: {0}", GetElapsedTime(stopWatch.Elapsed)));
                return response;
            }
            catch (Exception e)
            {
                _logger.ErrorException("FileController PostFloorPlan() has error.", e);
                throw;
            }
        }

        private static long? TryParseNullable(string val)
        {
            long outValue;
            return long.TryParse(val, NumberStyles.None, CultureInfo.InvariantCulture, out outValue) ? (long?)outValue : null;
        }

        private static string GetElapsedTime(TimeSpan timeSpan)
        {
            return String.Format(CultureInfo.InvariantCulture, "{0:00}:{1:00}:{2:00}.{3:00}",
                    timeSpan.Hours, timeSpan.Minutes, timeSpan.Seconds,timeSpan.Milliseconds / 10);
        }

        private long UpdateDatabase(string uniqueNumber, string iPAddress, string country, string floorPlanUrl, long? requestSectionId)
        {
            var session = _prototypeUow.Sessions.GetByUniqueNumber(uniqueNumber);
            if (session == null)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            session.IPAddress = iPAddress;
            session.Country = country;
            var section = new Section
            {
                Id = requestSectionId,
                FloorPlanUrl = _blobStorage.GetUrl(floorPlanUrl),
                Session = session
            };
            _prototypeUow.Sections.InsertOrUpdate(section);
            _prototypeUow.Commit();
            if (section.Id != null) return section.Id.Value;
            throw new ArgumentException("FileController UpdateDatabase() has error. section.Id is null");
        }

        private void UploadBlob(byte[] content, string blobFileName)
        {
            var stopWatchForBlob = new Stopwatch();
            stopWatchForBlob.Start();
            _blobStorage.Put(content,blobFileName);
            stopWatchForBlob.Stop();
            _logger.Info(String.Format(CultureInfo.InvariantCulture, "FileController  _blobStorage.Put() Total elapsed time: {0}", GetElapsedTime(stopWatchForBlob.Elapsed)));

        }

        private string GetBlobFileName(string fileName)
        {
            return String.Format(CultureInfo.InvariantCulture, "{0}/{1}", GetTimeStamp(), fileName);
        }

        private PostFloorPlanResponse GetResult(HttpContentHeaders headers, string fileName, long sectionId)
        {
            return new PostFloorPlanResponse
                {
                    Name = fileName,
                    Size = Convert.ToInt32(headers.ContentLength, CultureInfo.InvariantCulture),
                    Type = Convert.ToString(headers.ContentType, CultureInfo.InvariantCulture),
                    Url = _blobStorage.GetUrl(GetBlobFileName(fileName)),
                    SectionId = sectionId
                };
        }

        private string GetTimeStamp()
        {
            return DateTime.Now.ToString("yyyyMMdd");
        }
    }
}
