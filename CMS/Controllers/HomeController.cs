using CMS.Helpers;
using CMS.Models;
using CMS.Models.ViewModels;
using CMS.Services;
using System;
using System.Configuration;
using System.IO;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace CMS.Controllers
{
    public class HomeController : Controller
    {
        private readonly CMSEntities _db = new CMSEntities();

        public HomeController()
        {
        }

        [HttpGet]
        public ActionResult Index()
        {
            var info = _db.Infoes.Find(1);
            // SEO
            ViewBag.title = "Trang chủ";
            ViewBag.keywords = info.Keywords;
            ViewBag.description = info.Description;
            ViewBag.url = info.URL + "/";
            ViewBag.image = info.URL + info.Image;

            return View();
        }

        // POST: EmailContact
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> EmailContact(SendEmailContactViewModel model)
        {
            if (ModelState.IsValid)
            {
                // Get Template Email
                string template;
                using (var sr = new StreamReader(Server.MapPath("\\Content\\Email\\") + "Contact.html"))
                {
                    template = await sr.ReadToEndAsync();

                    string bodyEmail = string.Format(template, model.Name, model.Email, model.PhoneNumber, model.Company, model.Content);

                    // Send Email
                    EmailService emailService = new EmailService();
                    var result = await emailService.SendEmailAsync("hoanlk93@gmail.com", "Thông tin khách liên hệ", bodyEmail);

                    if (result == true)
                    {
                        return Json(new { result = 1 });
                    }
                }
            }

            return Json(new { result = 0 });
        }

        // Set Culture
        public ActionResult SetCulture(string culture)
        {
            // Validate input
            culture = CultureHelper.GetImplementedCulture(culture);
            // Save culture in a cookie
            HttpCookie cookie = Request.Cookies["_culture"];
            if (cookie != null)
                cookie.Value = culture;   // update cookie value
            else
            {
                cookie = new HttpCookie("_culture");
                cookie.Value = culture;
                cookie.Expires = DateTime.Now.AddMonths(1);
            }
            cookie.SameSite = SameSiteMode.Lax;
            Response.Cookies.Add(cookie);

            return Json(culture, JsonRequestBehavior.AllowGet);
        }

        private int? GetComponentId(string key)
        {
            if (int.TryParse(ConfigurationManager.AppSettings[key], out int id))
            {
                return id;
            }

            return null;
        }
    }
}
