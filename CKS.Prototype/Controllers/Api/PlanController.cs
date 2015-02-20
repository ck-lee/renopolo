using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Linq;
using CKS.Contracts;
using CKS.Entities;
using CKS.Prototype.Injections;
using CKS.ViewModels.Plan;
using Omu.ValueInjecter;

namespace CKS.Prototype.Controllers.Api
{
    public class PlanController : ApiController
    {
        private readonly ILogger _logger;
        private readonly IPrototypeUow _prototypeUow;
        private readonly IWebSecurity _webSecurity;
        private readonly HttpContextBase _context;

        public PlanController(ILogger logger, IPrototypeUow prototypeUow, IWebSecurity webSecurity, HttpContextBase context )
        {
            _logger = logger;
            _prototypeUow = prototypeUow;
            _webSecurity = webSecurity;
            _context = context;
        }
        [ActionName("Project")]
        public SaveProjectResponse PutProject(SaveProjectRequest saveProjectRequest)
        {
            if (saveProjectRequest == null)
                throw new ArgumentNullException("saveProjectRequest");
            try
            {
                if (_webSecurity.IsAuthenticated())
                {
                    var currentUserProfile = _prototypeUow.UserProfiles.GetByEmail(_webSecurity.CurrentUserName());
                    InsertOrUpdateProject(saveProjectRequest.Project, currentUserProfile);
                    return new SaveProjectResponse
                               {
                                   ProjectId = saveProjectRequest.Project.Id,
                                   Successful = true
                               };

                }
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }
            catch (Exception e)
            {
                _logger.ErrorException("PlanController SaveProject has error.", e);
                throw;
            }
        }

        [ActionName("Adjustments")]
        public SaveProjectResponse PutAdjustments(SaveProjectRequest saveProjectRequest)
        {
            if (saveProjectRequest == null)
                throw new ArgumentNullException("saveProjectRequest");
            var databaseSection = GetExisting(saveProjectRequest.Project);
            var requestSection = saveProjectRequest.Project.Sections.First();
            AppendAdjustmentsFromRequest(databaseSection, requestSection);
            return new SaveProjectResponse
            {
                Successful = true,
                SectionId = databaseSection.Id
            };
        }

        [ActionName("Projects")]
        public ICollection<Project> GetProjects()
        {
            if (_webSecurity.IsAuthenticated())
            {
                try
                {
                    var currentUserProfile = _prototypeUow.UserProfiles.GetByEmail(_webSecurity.CurrentUserName());
                    return currentUserProfile.Projects.OrderByDescending(p => p.LastModifiedDate).ToArray();

                }
                catch (Exception e)
                {
                    _logger.ErrorException("PlanController SaveProject has error.", e);
                    throw new HttpResponseException(HttpStatusCode.BadRequest);
                }
            }
            throw new HttpResponseException(HttpStatusCode.Unauthorized);
        }

        [ActionName("Section")]
        public SaveProjectResponse PostSection(SaveProjectRequest saveProjectRequest)
        {
            if (saveProjectRequest == null)
                throw new ArgumentNullException("saveProjectRequest");
            var httpCookie = _context.Request.Cookies.Get("ted");
            if (httpCookie == null)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            var requestSection = saveProjectRequest.Project.Sections.First();
            var databaseSection = GetExistingOrCreateNew(saveProjectRequest.Project);
            AppendSectionPropertiesFromRequest(databaseSection, requestSection);
            return new SaveProjectResponse
                       {
                           Successful = true,
                           SectionId = databaseSection.Id
                       };
        }

        private void AppendSectionPropertiesFromRequest(Section databaseSection, Section requestSection)
        {
            databaseSection.InjectFrom<ViewModelToEntity>(requestSection);
            _prototypeUow.Sections.InsertOrUpdate(databaseSection);
            _prototypeUow.Commit();
            _prototypeUow.Sections.AttachWalls(databaseSection, requestSection.Walls);
            _prototypeUow.Commit();
        }

        private void AppendAdjustmentsFromRequest(Section databaseSection, Section requestSection)
        {
            _prototypeUow.Sections.AttachAdjustments(databaseSection, requestSection.Adjustments);
            _prototypeUow.Commit();
        }

        private Section GetExistingOrCreateNew(Project project)
        {
            long? requestSectionId = project.Sections.First().Id;
            //if Section is new and does not have an ID
            if (requestSectionId == null)
            {
                var session = _prototypeUow.Sessions.GetByUniqueNumber(GetSessionKeyFromCookie());
                session.Sections = new Collection<Section>{new Section{Session = session}};
                return session.Sections.First();
            }
            //if Section already exists and has an ID
            return GetExisting(project);
        }

        private Section GetExisting(Project project)
        {
            var sectionId = project.Sections.First().Id;
            if (sectionId == null)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            var databaseSection = _prototypeUow.Sections.GetById((long)sectionId);
            if (project.Id.HasValue)
                CheckSectionUserProfile(databaseSection);
            else
                CheckSectionSession(databaseSection);
            return databaseSection;
        }

        private void CheckSectionUserProfile(Section databaseSection)
        {
            //Check if user is authenticated
            if (!_webSecurity.IsAuthenticated())
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            //Check if section belongs to current user
            if (databaseSection.Project.UserProfile.Email != _webSecurity.CurrentUserName())
                throw new HttpResponseException(HttpStatusCode.Forbidden);

        }

        private void CheckSectionSession(Section databaseSection)
        {
            if (databaseSection.Session.UniqueNumber != GetSessionKeyFromCookie())
                throw new HttpResponseException(HttpStatusCode.Forbidden);  
        }

        private string GetSessionKeyFromCookie()
        {
            var httpCookie = _context.Request.Cookies.Get("ted");
            if (httpCookie == null || httpCookie.Value == null)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            return httpCookie.Value;
        }

        private void CheckProjectUserProfile(Project project)
        {
            //Check if user is authenticated
            if (!_webSecurity.IsAuthenticated())
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            //Check if section belongs to current user
            if (project.UserProfile.Email != _webSecurity.CurrentUserName())
                throw new HttpResponseException(HttpStatusCode.Forbidden);
        }

        private void InsertOrUpdateProject(Project project, UserProfile userProfile)
        {
            project.UserProfile = userProfile;
            if (!project.Id.HasValue)
                _prototypeUow.Projects.Add(project);
            else
            {
                CheckProjectUserProfile(project);
                CheckCreatedDateSameAsDatabase(project);
                _prototypeUow.Projects.Update(project);
            }
            _prototypeUow.Commit();
        }

        private void CheckCreatedDateSameAsDatabase(Project project)
        {
            if (project.Id == null)
                throw new ArgumentException("PlanController CheckCreatedDateSameAsDatabase() has error.", "project");
            var dbProject = _prototypeUow.Projects.GetById(project.Id.Value);
            if (dbProject.CreatedDate != project.CreatedDate)
                throw new HttpResponseException(HttpStatusCode.Forbidden);
        }
    }
}
