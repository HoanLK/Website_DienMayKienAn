using AutoMapper;
using CMS.Models;
using CMS.Models.Resources.Brand;
using CMS.Services;
using DevExtreme.AspNet.Data;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace CMS.APIs
{
    [Authorize]
    public class BrandAPIController : ApiController
    {
        private readonly CMSEntities _db = new CMSEntities();
        private readonly Mapper _mapper;

        public BrandAPIController()
        {
            // MAPPER
            var config = new MapperConfiguration(
                cfg =>
                {
                    // Create
                    cfg.CreateMap<BrandCreateResource, Brand>();
                    // Edit
                    cfg.CreateMap<BrandEditResource, Brand>();
                    cfg.CreateMap<Brand, BrandEditResource>();
                }
            );
            _mapper = new Mapper(config);
        }

        // GET: api/BrandAPI
        public object Gets(DataSourceLoadOptions loadOptions)
        {
            if (loadOptions is null)
            {
                return BadRequest();
            }

            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(_db.Brands, loadOptions);
        }

        // GET: api/BrandAPI/5
        public async Task<IHttpActionResult> GetAsync(int id)
        {
            Brand data = await _db.Brands.FindAsync(id);
            if (data is null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<Brand, BrandEditResource>(data));
        }

        // PUT: api/BrandAPI/5
        public async Task<IHttpActionResult> PutAsync(int id, BrandEditResource resource)
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

            Brand data = await _db.Brands.FindAsync(id);

            if (data == null)
            {
                return NotFound();
            }

            _mapper.Map(resource, data);
            StringService stringService = new StringService();
            data.Slug = stringService.GenerateSlug(data.Name);
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

        // POST: api/BrandAPI
        public async Task<IHttpActionResult> PostAsync(BrandCreateResource resource)
        {
            if (resource is null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Brand data = _mapper.Map<BrandCreateResource, Brand>(resource);
            StringService stringService = new StringService();
            data.Slug = stringService.GenerateSlug(data.Name);
            data.CreateUser = User.Identity.GetUserId();
            data.CreateTime = DateTime.Now;

            _db.Brands.Add(data);

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

        // DELETE: api/BrandAPI/5
        public async Task<IHttpActionResult> DeleteAsync(int id)
        {
            Brand data = await _db.Brands.FindAsync(id);
            if (data is null)
            {
                return NotFound();
            }

            _db.Brands.Remove(data);

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