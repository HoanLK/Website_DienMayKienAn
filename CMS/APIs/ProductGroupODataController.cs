using CMS.Models;
using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.OData;

namespace CMS.APIs
{
    [Authorize]
    public class ProductGroupODataController : ODataController
    {
        private readonly CMSEntities _db = new CMSEntities();

        // GET: odata/ProductGroupOData
        [EnableQuery]
        public IQueryable<ProductGroup> Gets()
        {
            return _db.ProductGroups;
        }

        // PATCH: odata/ProductGroupOData(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<ProductGroup> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var data = await _db.ProductGroups.FindAsync(key);
            if (data is null)
            {
                return NotFound();
            }

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