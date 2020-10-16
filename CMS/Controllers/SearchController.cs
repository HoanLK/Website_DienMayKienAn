using CMS.Models;
using CMS.Models.ViewModels;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace CMS.Controllers
{
    [RoutePrefix("search")]
    public class SearchController : Controller
    {
        private readonly CMSEntities _db = new CMSEntities();

        // GET Index
        [Route("product")]
        public async Task<ActionResult> Product()
        {
            var info = _db.Infoes.Find(1);
            // SEO
            ViewBag.title = "Tìm kiếm";
            ViewBag.keywords = info.Keywords;
            ViewBag.description = info.Description;
            ViewBag.url = info.URL + "/search/product";
            ViewBag.image = info.URL + info.Image;

            var model = await _db.ProductCategories.AsNoTracking()
                                             .Where(c => c.Published == true && c.Products.Count > 0)
                                             .OrderByDescending(c => c.Featured)
                                                .ThenBy(c => c.SortOrder)
                                             .Select(c => new SearchViewModel
                                             {
                                                 Id = c.Id,
                                                 Name = c.Name,
                                                 Products = _db.Products.Where(p => p.CategoryId == c.Id)
                                                                        .OrderByDescending(p => p.Views)
                                                                            .ThenByDescending(p => p.Featured)
                                                                                .ThenBy(p => p.SortOrder)
                                                                        .Select(p => new ProductLessViewModel()
                                                                        {
                                                                            Id = p.Id,
                                                                            Name = p.Name,
                                                                            Slug = p.Slug,
                                                                            Type = p.Type,
                                                                            Price = p.Price,
                                                                            OldPrice = p.OldPrice,
                                                                            Image = p.Image,
                                                                            ThumbImage = p.ThumbImage
                                                                        })
                                                                        .ToList()
                                             })
                                             .ToListAsync();

            return View(model);
        }

        // GET: Search
        [Route("product/{text}")]
        public async Task<ActionResult> Product(string text)
        {
            var info = _db.Infoes.Find(1);
            // SEO
            ViewBag.title = text;
            ViewBag.keywords = info.Keywords;
            ViewBag.description = info.Description;
            ViewBag.url = info.URL + "/search/product/" + text;
            ViewBag.image = info.URL + info.Image;

            var model = await _db.ProductCategories.AsNoTracking()
                                                   .Where(c => c.Published == true && c.Products.Where(p => p.Name.Contains(text)).Count() > 0)
                                                   .OrderByDescending(c => c.Featured)
                                                    .ThenBy(c => c.SortOrder)
                                                   .Select(c => new SearchViewModel
                                                   {
                                                       Id = c.Id,
                                                       Name = c.Name,
                                                       Products = _db.Products.Where(p => p.CategoryId == c.Id && p.Name.Contains(text))
                                                                              .OrderByDescending(p => p.Views)
                                                                              .ThenByDescending(p => p.Featured)
                                                                                .ThenBy(p => p.SortOrder)
                                                                              .Select(p => new ProductLessViewModel()
                                                                              {
                                                                                  Id = p.Id,
                                                                                  Name = p.Name,
                                                                                  Slug = p.Slug,
                                                                                  Type = p.Type,
                                                                                  Price = p.Price,
                                                                                  OldPrice = p.OldPrice,
                                                                                  Image = p.Image,
                                                                                  ThumbImage = p.ThumbImage
                                                                              })
                                                                              .ToList()
                                                   })
                                                   .ToListAsync();

            return View(model);
        }
    }
}