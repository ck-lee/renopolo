using System.Diagnostics.CodeAnalysis;
using System.Web;
using System.Web.Mvc;

namespace CKS.Prototype.Controllers
{
    [ExcludeFromCodeCoverage]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var request = HttpContext.Request;
            //this will be true when it's their first visit to the site (will happen again if they clear cookies)
                //give old IE users a warning the first time
                if (request.Browser.Browser.Trim().ToUpperInvariant().Equals("IE") && request.Browser.MajorVersion <= 8)
                {
                    return new RedirectResult("/Templates/NotSupported.html");
                }
            return View();
        }

        public ActionResult About()
        {
            return new RedirectResult("/Templates/about.html");
        }
    }
}
