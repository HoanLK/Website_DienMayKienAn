using CMS.Models;
using CMS.Services;
using System;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.OData;

namespace CMS.APIs
{
    [Authorize]
    public class ProductODataController : ODataController
    {
        private readonly CMSEntities _db = new CMSEntities();

        // PATCH: odata/ProductOData(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Product> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var data = await _db.Products.FindAsync(key);
            if (data is null)
            {
                return NotFound();
            }

            StringService stringService = new StringService();
            data.Slug = stringService.GenerateSlug(data.Name);
            // Logs
            data.ModifyTime = DateTime.Now;
            data.ModifyUser = User.Identity.Name;

            patch.Patch(data);
            _db.Entry(data).State = EntityState.Modified;

            try
            {
                await _db.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest("Lưu thất bại");
            }

            return Ok();
        }
    }
}