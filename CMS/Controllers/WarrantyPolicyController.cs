using CMS.Models;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace CMS.Controllers
{
    [RoutePrefix("warranty-policy")]
    public class WarrantyPolicyController : Controller
    {
        private readonly CMSEntities _db = new CMSEntities();

        // GET: /certificates
        [Route()]
        public async Task<ActionResult> Index()
        {
            var info = _db.Infoes.Find(1);
            var model = await _db.Posts.FirstOrDefaultAsync(p => p.Id == 1);

            // SEO
            ViewBag.title = "Chính sách bảo hành";
            ViewBag.keywords = info.Keywords;
            ViewBag.description = info.Description;
            ViewBag.url = info.URL + "/warranty-policy";
            ViewBag.image = info.URL + info.Image;

            return View(model);
        }
    }
}