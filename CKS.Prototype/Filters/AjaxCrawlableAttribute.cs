using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace CKS.Prototype.Filters
{
    public class AjaxCrawlableAttribute : ActionFilterAttribute
    {
        private const string Fragment = "_escaped_fragment_";

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var request = filterContext.RequestContext.HttpContext.Request;

            if (string.IsNullOrWhiteSpace(request.QueryString[Fragment]))
                return;

            var parts = request.QueryString[Fragment].Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);

            if (parts.Length > 0)
            {
                switch (parts[0].ToLowerInvariant())
                {
                    case "about":
                        filterContext.Result = new RedirectResult("/Templates/About/about.html");
                        break;
                    case "post":
                        RedirectPostSteps(filterContext, parts[1]);
                        break;
                    default:
                        filterContext.Result = new RedirectResult("/Templates/home.html");
                        break;
                }
                
            }

            
        }

        private static void RedirectPostSteps(ActionExecutingContext filterContext, string part1)
        {
            if (!part1.ToLowerInvariant().Contains("step"))
            {
                filterContext.Result = new RedirectResult("/Templates/Post/plan-step1.html");
            }
            filterContext.Result = new RedirectResult("/Templates/Post/plan-" + part1 + ".html");
        }
    }

}