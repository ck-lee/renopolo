using System;
using System.Diagnostics.CodeAnalysis;
using System.Web.Mvc;
using CKS.Prototype.Filters;

namespace CKS.Prototype
{
    [ExcludeFromCodeCoverage]
    public static class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            if (filters == null) throw new ArgumentNullException("filters");
            filters.Add(new HandleErrorAttribute());
            filters.Add(new AjaxCrawlableAttribute());
        }
    }
}