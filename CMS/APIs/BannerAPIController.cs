using AutoMapper;
using CMS.Models;
using CMS.Models.Resources.Banner;
using DevExtreme.AspNet.Data;
using Microsoft.AspNet.Identity;
using System;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Web.Http;

namespace CMS.APIs
{
    [Authorize]
    public class BannerAPIController : ApiController
    {
        private readonly CMSEntities _db = new CMSEntities();
        private readonly Mapper _mapper;

        public BannerAPIController()
        {
            // MAPPER
            var config = new MapperConfiguration(
                cfg =>
                {
                    // Create
                    cfg.CreateMap<BannerCreateResource, Banner>();
                    // Edit
                    cfg.CreateMap<BannerEditResource, Banner>();
                    cfg.CreateMap<Banner, BannerEditResource>();
                }
            );
            _mapper = new Mapper(config);
        }

        // GET: api/BannerAPI
        public object Gets(DataSourceLoadOptions loadOptions)
        {
            if (loadOptions is null)
            {
                return BadRequest();
            }

            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(_db.Banners, loadOptions);
        }

        // GET: api/BannerAPI/5
        public async Task<IHttpActionResult> GetAsync(int id)
        {
            Banner data = await _db.Banners.FindAsync(id);
            if (data is null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<Banner, BannerEditResource>(data));
        }

        // PUT: api/BannerAPI/5
        public async Task<IHttpActionResult> PutAsync(int id, BannerEditResource resource)
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

            Banner data = await _db.Banners.FindAsync(id);

            if (data == null)
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

        // POST: api/BannerAPI
        public async Task<IHttpActionResult> PostAsync(BannerCreateResource resource)
        {
            if (resource is null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Banner data = _mapper.Map<BannerCreateResource, Banner>(resource);
            data.CreateUser = User.Identity.GetUserId();
            data.CreateTime = DateTime.Now;

            _db.Banners.Add(data);

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

        // DELETE: api/BannerAPI/5
        public async Task<IHttpActionResult> DeleteAsync(int id)
        {
            Banner data = await _db.Banners.FindAsync(id);
            if (data is null)
            {
                return NotFound();
            }

            _db.Banners.Remove(data);

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