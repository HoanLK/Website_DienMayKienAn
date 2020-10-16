using CMS.Models;
using CMS.Models.ViewModels;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace CMS.Controllers
{
    public class LayoutController : Controller
    {
        private readonly CMSEntities _db = new CMSEntities();

        // GET: Layout
        public ActionResult Index()
        {
            return View();
        }

        // GET: Header
        public ActionResult Header()
        {
            var info = _db.Infoes.Find(1);
            var categories = _db.ProductCategories.AsNoTracking()
                                                  .Where(c => c.Published == true)
                                                  .OrderByDescending(p => p.Featured)
                                                    .ThenBy(p => p.SortOrder)
                                                  .Select(c => new ProductCategoryLessViewModel
                                                  {
                                                      Id = c.Id,
                                                      Name = c.Name,
                                                      Slug = c.Slug
                                                  })
                                                  .ToList();

            HeaderViewModel model = new HeaderViewModel()
            {
                Info = info,
                Categories = categories
            };

            return PartialView("~/Views/Shared/_Header.cshtml", model);
        }

        // GET: Header Fixed 
        public ActionResult HeaderFixed()
        {
            var model = _db.Infoes.Find(1);

            return PartialView("~/Views/Shared/_HeaderFixed.cshtml", model);
        }

        // GET: MenuProduct
        public ActionResult MenuProduct()
        {
            var categories = _db.ProductCategories.AsNoTracking()
                                                  .Where(c => c.Published == true)
                                                  .OrderByDescending(p => p.Featured)
                                                    .ThenBy(p => p.SortOrder)
                                                  .Select(p => new ProductCategoryLessViewModel()
                                                  {
                                                      Id = p.Id,
                                                      Name = p.Name,
                                                      Icon = p.Icon,
                                                      Slug = p.Slug
                                                  })
                                                  .ToList();

            List<ProductCategoryViewModel> model = new List<ProductCategoryViewModel>();
            foreach (var category in categories)
            {
                // Get BrandIds
                var brandIds = _db.Products.AsNoTracking()
                                           .Where(p => p.CategoryId == category.Id && p.Published == true)
                                           .Select(p => p.BrandId)
                                           .Distinct()
                                           .ToList();
                ProductCategoryViewModel temp = new ProductCategoryViewModel
                {
                    Category = category,
                    Brands = _db.Brands.AsNoTracking()
                                       .Where(b => brandIds.Any(i => i == b.Id))
                                       .OrderBy(p => p.Name)
                                       .Select(b => new BrandLessModel()
                                       {
                                           Id = b.Id,
                                           Image = b.Image,
                                           Name = b.Name,
                                           Slug = b.Slug
                                       })
                                       .ToList()
                };

                model.Add(temp);
            }


            return PartialView("~/Views/Shared/Header/_MenuProduct.cshtml", model);
        }

        // GET: Banner
        public ActionResult Banner()
        {
            var model = _db.Banners.AsNoTracking()
                                   .Where(p => p.Published == true)
                                   .OrderBy(p => p.SortOrder)
                                   .Select(p => new BannerLessViewModel()
                                   {
                                       Id = p.Id,
                                       Image = p.Image,
                                       SortOrder = p.SortOrder
                                   })
                                   .ToList();

            return PartialView("~/Views/Shared/_Banner.cshtml", model);
        }

        // GET: Footer
        public ActionResult Footer()
        {
            FooterViewModel model = new FooterViewModel()
            {
                Info = _db.Infoes.Find(1),
                Categories = _db.ProductCategories.AsNoTracking()
                                                  .Where(c => c.Published == true)
                                                  .OrderByDescending(p => p.Featured)
                                                    .ThenBy(p => p.SortOrder)
                                                  .Select(c => new ProductCategoryLessViewModel
                                                  {
                                                      Id = c.Id,
                                                      Name = c.Name,
                                                      Slug = c.Slug
                                                  })
                                                  .ToList()
            };

            return PartialView("~/Views/Shared/_Footer.cshtml", model);
        }

    }
}