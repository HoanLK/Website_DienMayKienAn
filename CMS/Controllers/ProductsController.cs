using CMS.Models;
using CMS.Models.ViewModels;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace CMS.Controllers
{
    [RoutePrefix("products")]
    public class ProductsController : Controller
    {
        private readonly CMSEntities _db = new CMSEntities();

        // GET: Product
        [Route()]
        public ActionResult Index()
        {
            return RedirectToAction("Index", "Home");
        }

        // GET: Product/abc-5
        [Route("{slug}-{id}")]
        public async Task<ActionResult> Detail(string slug, int id)
        {
            var info = _db.Infoes.Find(1);
            var product = await _db.Products.FindAsync(id);
            if (product == null)
            {
                return View("~/Views/Shared/_NotFound.cshtml");
            }
            else
            {
                product.Views += 1;
                _db.Entry(product).State = EntityState.Modified;

                try
                {
                    await _db.SaveChangesAsync();
                }
                catch (System.Exception)
                {
                    throw;
                }
            }

            // SEO
            ViewBag.title = product.Name;
            ViewBag.keywords = product.SEO_Keywords;
            ViewBag.description = product.SEO_Description;
            ViewBag.url = $"{info.URL}/products/{slug}-{id}";
            ViewBag.image = info.URL + product.Image;

            // Prices
            var prices = await _db.Products.AsNoTracking()
                                           .Where(p => p.GroupId == product.GroupId && p.GroupId != null && p.Published == true)
                                           .Select(p => new PriceProductViewModel()
                                           {
                                               Id = p.Id,
                                               Code = p.Code,
                                               Name = p.Name,
                                               Price = p.Price,
                                               IsCurrent = p.Id == id,
                                               Slug = p.Slug
                                           })
                                           .ToListAsync();
            // Tech Infos
            List<FieldValueViewModel> techInfos = new List<FieldValueViewModel>();
            if (!string.IsNullOrEmpty(product.Feature) && product.Feature != "[]")
            {
                techInfos = JsonConvert.DeserializeObject<List<FieldValueViewModel>>(product.Feature);
            }

            // Competitor Prices
            List<CompetitorPriceViewModel> competitorPrices = new List<CompetitorPriceViewModel>();
            if (!string.IsNullOrEmpty(product.Prices) && product.Prices != "[]")
            {
                competitorPrices = JsonConvert.DeserializeObject<List<CompetitorPriceViewModel>>(product.Prices);

                foreach (var price in competitorPrices)
                {
                    var brand = await _db.Brands.FindAsync(price.Id);
                    price.Logo = brand.Image;
                    price.Name = brand.Name;
                    price.Price = (!string.IsNullOrEmpty(price.Price.ToString())) ? price.Price : 0;
                }
            }

            ProductViewModel model = new ProductViewModel()
            {
                Product = product,
                Prices = prices,
                TechInfos = techInfos,
                CompetitorPrices = competitorPrices
            };

            return View(model);
        }

        // GET: Product/Search/true
        [Route("Search/{isSuggest}")]
        public JsonResult Search(bool isSuggest = true)
        {
            if (isSuggest)
            {
                return null;
            }
            else
            {
                return null;
            }
        }

        // GET: Product/Search/true/abc
        [Route("Search/{isSuggest}/{text}")]
        public async Task<JsonResult> Search(bool isSuggest = true, string text = " ")
        {
            if (isSuggest)
            {
                if (string.IsNullOrEmpty(text))
                {
                    return null;
                }
                else
                {
                    var model = await _db.Products.AsNoTracking()
                                                  .Where(p => p.Name.Contains(text))
                                                  .OrderByDescending(p => p.Views)
                                                    .OrderBy(p => p.SortOrder)
                                                  .Select(p => new ProductLessViewModel()
                                                  {
                                                      Id = p.Id,
                                                      Name = p.Name,
                                                      Price = p.Price,
                                                      Image = p.Image,
                                                      ThumbImage = p.ThumbImage,
                                                      Slug = p.Slug
                                                  })
                                                  .ToListAsync();

                    return Json(model, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                return null;
            }
        }

        #region [ PARTIAL VIEW ]
        // Relate Products
        public ActionResult RelateProducts(int productId, int categoryId, int brandId)
        {
            var model = _db.Products.AsNoTracking()
                                    .Where(p => p.Id != productId && p.Published == true && p.CategoryId == categoryId)
                                    .OrderByDescending(p => p.BrandId == brandId)
                                        .ThenByDescending(p => p.Views)
                                            .ThenByDescending(p => p.Featured)
                                                .ThenBy(p => p.SortOrder)
                                    .Take(10)
                                    .Select(p => new ProductLessViewModel()
                                    {
                                        Id = p.Id,
                                        Name = p.Name,
                                        Slug = p.Slug,
                                        Image = p.Image,
                                        ThumbImage = p.ThumbImage,
                                        Type = p.Type,
                                        OldPrice = p.OldPrice,
                                        Price = p.Price
                                    })
                                    .ToList();

            return PartialView("~/Views/Products/_RelateProducts.cshtml", model);
        }
        #endregion
    }
}