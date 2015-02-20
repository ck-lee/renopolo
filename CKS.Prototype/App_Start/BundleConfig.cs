using System;
using System.Diagnostics.CodeAnalysis;
using System.Web.Optimization;

namespace CKS.Prototype
{
    [ExcludeFromCodeCoverage]
    public static class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            if (bundles == null) throw new ArgumentNullException("bundles");
            bundles.Add(new ScriptBundle("~/bundles/cks").Include(
                        "~/Scripts/Entities/*.js",
                        "~/Scripts/ViewModels/*.js",
                        "~/Scripts/ViewModels/Estimate/*.js",
                        "~/Scripts/ViewMediators/*.js",
                        "~/Scripts/Application/cks.*"));

            bundles.Add(new ScriptBundle("~/bundles/libraries").Include(
                        "~/Scripts/ThirdParty/knockout-*",
                        "~/Scripts/ThirdParty/underscore.*",
                        "~/Scripts/ThirdParty/sammy/sammy-{version}.js",
                        "~/Scripts/ThirdParty/bootstrap.js",
                        "~/Scripts/ThirdParty/jquery.pnotify.*",
                        "~/Scripts/ThirdParty/m-*",
                        "~/Scripts/ThirdParty/raphael*",
                        "~/Scripts/ThirdParty/jquery.colorbox.*",
                        "~/Scripts/ThirdParty/select2.*",
                        "~/Scripts/ThirdParty/bootstrap.file-input.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/ThirdParty/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/ThirdParty/jquery-ui-1.9.2.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/ThirdParty/jquery.unobtrusive*",
                        "~/Scripts/ThirdParty/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/jquerymobile").Include(
                        "~/Scripts/ThirdParty/jquery.mobile-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/fileupload").Include(
                        "~/Scripts/ThirdParty/fileupload/vendor/jquery.ui.widget.js",
                        "~/Scripts/ThirdParty/fileupload/jquery.iframe-transport.js",
                        "~/Scripts/ThirdParty/fileupload/jquery.fileupload.js"
                        ));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/ThirdParty/modernizr-*"));

            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
                        "~/Content/themes/base/jquery.ui.core.css",
                        "~/Content/themes/base/jquery.ui.resizable.css",
                        "~/Content/themes/base/jquery.ui.selectable.css",
                        "~/Content/themes/base/jquery.ui.accordion.css",
                        "~/Content/themes/base/jquery.ui.autocomplete.css",
                        "~/Content/themes/base/jquery.ui.button.css",
                        "~/Content/themes/base/jquery.ui.dialog.css",
                        "~/Content/themes/base/jquery.ui.slider.css",
                        "~/Content/themes/base/jquery.ui.tabs.css",
                        "~/Content/themes/base/jquery.ui.datepicker.css",
                        "~/Content/themes/base/jquery.ui.progressbar.css",
                        "~/Content/themes/base/jquery.ui.theme.css"));

            bundles.Add(new StyleBundle("~/Content/css")
                .Include
                ("~/Content/jquery.fileupload-ui.css",
                "~/Content/bootstrap*",
                "~/Content/font-awesome.css",
                "~/Content/m-buttons.css",
                "~/Content/m-forms.css",
                "~/Content/m-icons.css",
                "~/Content/colorbox.css",
                "~/Content/jquery.pnotify.default.css",
                "~/Content/jquery.pnotify.default.icons.css",
                "~/Content/select2.css",
                "~/Content/select2-bootstrap.css",
                "~/Content/site.css"));

            bundles.Add(new StyleBundle("~/Content/css-mobile").Include(
                "~/Content/jquery.fileupload-ui.css",
                "~/Content/bootstrap*",
                "~/Content/font-awesome.css",
                "~/Content/m-buttons.css",
                "~/Content/m-forms.css",
                "~/Content/m-icons.css",
                "~/Content/colorbox.css",
                "~/Content/jquery.pnotify.default.css",
                "~/Content/jquery.pnotify.default.icons.css",
                "~/Content/select2.css",
                "~/Content/select2-bootstrap.css",
                "~/Content/site.mobile.css",
                "~/Content/jquery.mobile.structure-1.3.1.css",
                "~/Content/jquery.mobile.theme-1.3.1.css"));

        }
    }
}