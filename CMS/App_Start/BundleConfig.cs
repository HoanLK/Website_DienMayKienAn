using System.Web.Optimization;

namespace CMS
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            // CSS
            bundles.Add(new StyleBundle("~/css").Include(
                "~/Content/Frontend/css/plugin/plugins.min.css",
                "~/Content/Frontend/css/vendor/vendor.min.css",
                "~/Content/Frontend/css/main.css"
            ));

            // JS
            bundles.Add(new ScriptBundle("~/js").Include(
                "~/Content/Frontend/js/vendor/vendor.min.js",
                "~/Content/Frontend/js/plugin/plugins.min.js",
                "~/Content/Vendors/readmore.js/readmore.min.js",
                "~/Content/Frontend/js/main.js"
            ));

            // AngularJS
            bundles.Add(new ScriptBundle("~/angularjs").Include(
                "~/Content/Vendors/angular/angular.min.js",
                "~/Scripts/Frontend/frontend.js"
            ));

            BundleTable.EnableOptimizations = true;
        }
    }
}
