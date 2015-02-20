using System.Diagnostics.CodeAnalysis;
using System.Web;
using CKS.BlobLayer;
using CKS.Contracts;
using CKS.DataLayer;
using CKS.DataLayer.Helpers;
using CKS.DiagnosticsWrapper;
using CKS.Prototype.Wrappers;
using Microsoft.Practices.Unity;

namespace CKS.Prototype
{
    [ExcludeFromCodeCoverage]
    public static class UnityConfig
    {
        public static IUnityContainer BuildUnityContainer()
        {
            var container = new UnityContainer(); 
            container.RegisterType<ILogger, Logger>();
            container.RegisterType<IWebSecurity, WebSecurityWrapper>(new ContainerControlledLifetimeManager());
            container.RegisterType<IPrototypeUow, PrototypeUow>(new ContainerControlledLifetimeManager());
            container.RegisterType<IRepositoryProvider, RepositoryProvider>(new ContainerControlledLifetimeManager());
            container.RegisterType<RepositoryFactories>(new ContainerControlledLifetimeManager());
            container.RegisterType<IBlobStorage, AzureBlobStorage>();
            container.RegisterType<HttpContextBase>(new InjectionFactory(c => new HttpContextWrapper(HttpContext.Current)));
            container.RegisterType<IApiRequest, ApiRequestWrapper>();
            // register all your components with the container here
            // e.g. container.RegisterType<ITestService, TestService>();            

            return container;
        }
    }
}