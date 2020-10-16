using AutoMapper;
using CMS.Models;
using CMS.Models.Resources.ProductGroup;
using DevExtreme.AspNet.Data;
using Microsoft.AspNet.Identity;
using System;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Web.Http;

namespace CMS.APIs
{
    [Authorize]
    public class ProductGroupAPIController : ApiController
    {
        private readonly CMSEntities _db = new CMSEntities();
        private readonly Mapper _mapper;

        public ProductGroupAPIController()
        {
            // MAPPER
            var config = new MapperConfiguration(
                cfg =>
                {
                    // Create
                    cfg.CreateMap<ProductGroupCreateResource, ProductGroup>();
                    // Edit
                    cfg.CreateMap<ProductGroupEditResource, ProductGroup>();
                    cfg.CreateMap<ProductGroup, ProductGroupEditResource>();
                }
            );
            _mapper = new Mapper(config);
        }

        // GET: api/ProductGroupAPI
        public object Gets(DataSourceLoadOptions loadOptions)
        {
            if (loadOptions is null)
            {
                return BadRequest();
            }

            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(_db.ProductGroups, loadOptions);
        }

        // GET: api/ProductGroupAPI/5
        public async Task<IHttpActionResult> GetAsync(int id)
        {
            ProductGroup data = await _db.ProductGroups.FindAsync(id);

            if (data is null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<ProductGroup, ProductGroupEditResource>(data));
        }

        // PUT: api/ProductGroupAPI/5
        public async Task<IHttpActionResult> PutAsync(int id, ProductGroupEditResource resource)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != resource.Id)
            {
                return BadRequest();
            }

            if (resource is null)
            {
                return BadRequest();
            }

            ProductGroup data = await _db.ProductGroups.FindAsync(id);

            if (data is null)
            {
                return NotFound();
            }

            _mapper.Map(resource, data);
            data.ModifyUser = User.Identity.GetUserId();
            data.ModifyTime = DateTime.Now;

            _db.Entry(data).State = EntityState.Modified;

            try
            {
                await _db.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }

            return Ok();
        }

        // POST: api/ProductGroupAPI
        public async Task<IHttpActionResult> PostAsync(ProductGroupCreateResource resource)
        {
            if (resource is null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ProductGroup data = _mapper.Map<ProductGroupCreateResource, ProductGroup>(resource);
            data.CreateUser = User.Identity.GetUserId();
            data.CreateTime = DateTime.Now;

            _db.ProductGroups.Add(data);

            try
            {
                await _db.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }

            return Ok(data.Id);
        }

        // DELETE: api/ProductGroupAPI/5
        public async Task<IHttpActionResult> DeleteAsync(int id)
        {
            ProductGroup data = await _db.ProductGroups.FindAsync(id);
            if (data is null)
            {
                return NotFound();
            }

            _db.ProductGroups.Remove(data);

            try
            {
                await _db.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }

            return Ok();
        }
    }
}