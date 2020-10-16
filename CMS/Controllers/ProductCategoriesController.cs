using CMS.Models;
using CMS.Models.ViewModels;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace CMS.Controllers
{
    [RoutePrefix("product-categories")]
    public class ProductCategoriesController : Controller
    {
        private readonly CMSEntities _db = new CMSEntities();

        // GET: /product-categories
        [Route()]
        public ActionResult Index()
        {
            return RedirectToAction("Index", "Home");
        }

        // GET: /product-categories/abc-5/abc-5
        [Route("{slug}-{id}")]
        public async Task<ActionResult> Detail(string slug, int id)
        {
            var info = _db.Infoes.Find(1);
            var brandIds = await _db.Products.AsNoTracking()
                                             .Where(p => p.CategoryId == id && p.Published == true)
                                             .Select(p => p.BrandId)
                                             .Distinct()
                                             .ToListAsync();
            ProductCategoryViewModel model = new ProductCategoryViewModel
            {
                Category = await _db.ProductCategories.AsNoTracking()
                                                      .Where(p => p.Id == id)
                                                      .Select(p => new ProductCategoryLessViewModel()
                                                      {
                                                          Id = p.Id,
                                                          Name = p.Name,
                                                          Image = p.Image,
                                                          Featured = p.Featured,
                                                          CountImageBanner = p.CountImageBanner,
                                                          Slug = p.Slug,
                                                          SEO_Description = p.SEO_Description,
                                                          SEO_Image = p.SEO_Image,
                                                          SEO_Keywords = p.SEO_Keywords,
                                                          SEO_Title = p.SEO_Title,
                                                          ProductCategoryImages = p.ProductCategoryImages.Select(image => new ProductCategoryImageLessViewModel()
                                                          {
                                                              Link = image.Link,
                                                          }).ToList()
                                                      })
                                                      .FirstOrDefaultAsync(),
                Products = await _db.Products.AsNoTracking()
                                             .Where(p => p.CategoryId == id && p.Published == true)
                                             .OrderByDescending(p => p.Views)
                                                .ThenBy(p => p.SortOrder)
                                             .Select(p => new ProductLessViewModel()
                                             {
                                                 Id = p.Id,
                                                 Image = p.Image,
                                                 ThumbImage = p.ThumbImage,
                                                 Name = p.Name,
                                                 OldPrice = p.OldPrice,
                                                 Price = p.Price,
                                                 Slug = p.Slug,
                                                 Type = p.Type,
                                             })
                                             .ToListAsync(),
                Brands = await _db.Brands.AsNoTracking()
                                         .Where(b => brandIds.Any(i => i == b.Id))
                                         .OrderBy(p => p.Name)
                                         .Select(b => new BrandLessModel()
                                         {
                                             Id = b.Id,
                                             Image = b.Image,
                                             Name = b.Name,
                                             Slug = b.Slug,
                                         })
                                         .ToListAsync()
            };

            // SEO
            ViewBag.title = model.Category.Name;
            ViewBag.keywords = model.Category.SEO_Keywords;
            ViewBag.description = model.Category.SEO_Description;
            ViewBag.url = $"{info.URL}/product-categories/{slug}-{id}";
            ViewBag.image = info.URL + model.Category.Image;

            return View(model);
        }

        // GET: /product-categories/abc-5/abc-6
        [Route("{categorySlug}-{categoryId}/{brandSlug}-{brandId}")]
        public async Task<ActionResult> Detail(string categorySlug, int categoryId, string brandSlug, int brandId)
        {
            var info = _db.Infoes.Find(1);
            var brandIds = await _db.Products.AsNoTracking()
                                             .Where(p => p.CategoryId == categoryId && p.Published == true)
                                             .Select(p => p.BrandId)
                                             .Distinct()
                                             .ToListAsync();
            ProductCategoryViewModel model = new ProductCategoryViewModel
            {
                Category = await _db.ProductCategories.AsNoTracking()
                                                      .Where(p => p.Id == categoryId)
                                                      .Select(p => new ProductCategoryLessViewModel()
                                                      {
                                                          Id = p.Id,
                                                          Name = p.Name,
                                                          Image = p.Image,
                                                          Featured = p.Featured,
                                                          CountImageBanner = p.CountImageBanner,
                                                          Slug = p.Slug,
                                                          SEO_Description = p.SEO_Description,
                                                          SEO_Image = p.SEO_Image,
                                                          SEO_Keywords = p.SEO_Keywords,
                                                          SEO_Title = p.SEO_Title,
                                                          ProductCategoryImages = p.ProductCategoryImages.Select(image => new ProductCategoryImageLessViewModel()
                                                          {
                                                              Link = image.Link,
                                                          }).ToList()
                                                      })
                                                      .FirstOrDefaultAsync(),
                Products = await _db.Products.AsNoTracking()
                                             .Where(p => p.CategoryId == categoryId && p.BrandId == brandId && p.Published == true)
                                             .OrderByDescending(p => p.Views)
                                                .ThenBy(p => p.SortOrder)
                                             .Select(p => new ProductLessViewModel()
                                             {
                                                 Id = p.Id,
                                                 Image = p.Image,
                                                 ThumbImage = p.ThumbImage,
                                                 Name = p.Name,
                                                 OldPrice = p.OldPrice,
                                                 Price = p.Price,
                                                 Slug = p.Slug,
                                                 Type = p.Type,
                                             })
                                             .ToListAsync(),
                Brands = await _db.Brands.AsNoTracking()
                                         .Where(b => brandIds.Any(i => i == b.Id))
                                         .OrderBy(p => p.Name)
                                         .Select(b => new BrandLessModel()
                                         {
                                             Id = b.Id,
                                             Image = b.Image,
                                             Name = b.Name,
                                             Slug = b.Slug
                                         })
                                         .ToListAsync()
            };

            // SEO
            ViewBag.title = model.Category.Name;
            ViewBag.keywords = model.Category.SEO_Keywords;
            ViewBag.description = model.Category.SEO_Description;
            ViewBag.url = $"{info.URL}/product-categories/{categorySlug}-{categoryId}/{brandSlug}-{brandId}";
            ViewBag.image = info.URL + model.Category.Image;

            return View(model);
        }

        #region [ PARTIAL VIEW ]
        // Featured Categories
        public ActionResult FeaturedCategories()
        {
            var categories = _db.ProductCategories.AsNoTracking()
                                                  .Where(c => c.Published == true && c.Products.Where(p => p.Featured == true).Count() > 0)
                                                  .Take(8)
                                                  .OrderBy(p => p.SortOrder)
                                                  .Select(p => new ProductCategoryLessViewModel()
                                                  {
                                                      Id = p.Id,
                                                      Name = p.Name,
                                                      CountImageBanner = p.CountImageBanner,
                                                      Slug = p.Slug,
                                                      ProductCategoryImages = p.ProductCategoryImages.Select(image => new ProductCategoryImageLessViewModel()
                                                      {
                                                          Description = image.Description,
                                                          Link = image.Link,
                                                          Title = image.Title
                                                      })
                                                      .ToList()
                                                  })
                                                  .ToList();
            var model = new List<ProductCategoryViewModel>();
            foreach (var category in categories)
            {
                var brandIds = _db.Products.AsNoTracking()
                                           .Where(p => p.CategoryId == category.Id && p.Published == true)
                                           .Select(p => p.BrandId)
                                           .Distinct()
                                           .ToList();
                ProductCategoryViewModel temp = new ProductCategoryViewModel
                {
                    Category = category,
                    Products = _db.Products.AsNoTracking()
                                           .Where(p => p.CategoryId == category.Id && p.Published == true && p.Featured == true)
                                           .Take(10)
                                           .OrderByDescending(p => p.Views)
                                            .ThenBy(p => p.SortOrder)
                                           .Select(p => new ProductLessViewModel()
                                           {
                                               Id = p.Id,
                                               Image = p.Image,
                                               ThumbImage = p.ThumbImage,
                                               Name = p.Name,
                                               OldPrice = p.OldPrice,
                                               Price = p.Price,
                                               Type = p.Type,
                                               Slug = p.Slug,
                                           })
                                           .ToList(),
                    Brands = _db.Brands.AsNoTracking()
                                       .Where(b => brandIds.Any(id => id == b.Id))
                                       .OrderBy(p => p.Name)
                                       .Select(b => new BrandLessModel()
                                       {
                                           Id = b.Id,
                                           Name = b.Name,
                                           Slug = b.Slug
                                       })
                                       .ToList()
                };

                model.Add(temp);
            }

            return PartialView("~/Views/ProductCategories/_FeaturedCategories.cshtml", model);
        }
        // Sidebar Categories
        public ActionResult SidebarCategories()
        {
            var model = _db.ProductCategories.AsNoTracking()
                                                  .Where(c => c.Published == true)
                                                  .OrderByDescending(p => p.Featured)
                                                    .ThenBy(p => p.SortOrder)
                                                  .Select(p => new ProductCategoryLessViewModel()
                                                  {
                                                      Id = p.Id,
                                                      Name = p.Name,
                                                      Slug = p.Slug,
                                                      Icon = p.Icon
                                                  })
                                                  .ToList();

            return PartialView("~/Views/ProductCategories/_SidebarCategories.cshtml", model);
        }
        #endregion
    }
}