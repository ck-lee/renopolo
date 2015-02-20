using System;
using System.Diagnostics.CodeAnalysis;
using System.Web.Http;
using Newtonsoft.Json.Serialization;

namespace CKS.Prototype
{
    [ExcludeFromCodeCoverage]
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            if (config == null) throw new ArgumentNullException("config");

            config.Routes.MapHttpRoute(
                name: "PlanControllerApi",
                routeTemplate: "api/plan/{action}/{id}",
                defaults: new { controller = "Plan", id = RouteParameter.Optional }
            );
            
            config.Routes.MapHttpRoute(
                name: "FileControllerApi",
                routeTemplate: "api/file/{action}/{filename}",
                defaults: new { controller = "File", filename = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "AccountControllerApi",
                routeTemplate: "api/account/{action}/",
                defaults: new { controller = "Account" }
            );
            
            var jsonFormatter = config.Formatters.JsonFormatter;
            jsonFormatter.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
            jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        }
    }
}
