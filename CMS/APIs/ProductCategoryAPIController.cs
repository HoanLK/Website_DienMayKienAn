using AutoMapper;
using CMS.Models;
using CMS.Models.Resources.ProductCategory;
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
    public class ProductCategoryAPIController : ApiController
    {
        private readonly CMSEntities _db = new CMSEntities();
        private readonly Mapper _mapper;

        public ProductCategoryAPIController()
        {
            // MAPPER
            var config = new MapperConfiguration(
                cfg =>
                {
                    // Create
                    cfg.CreateMap<ProductCategoryCreateResource, ProductCategory>();
                    // Edit
                    cfg.CreateMap<ProductCategoryEditResource, ProductCategory>();
                    cfg.CreateMap<ProductCategory, ProductCategoryEditResource>().ForMember(r => r.Images, opt => opt.MapFrom(c => c.ProductCategoryImages.Select(p => p.Link)));
                }
            );
            _mapper = new Mapper(config);
        }

        // GET: api/ProductCategoryAPI
        public object Gets(DataSourceLoadOptions loadOptions)
        {
            if (loadOptions is null)
            {
                return BadRequest();
            }

            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(_db.ProductCategories, loadOptions);
        }

        // GET: api/ProductCategoryAPI/5
        public async Task<IHttpActionResult> GetAsync(int id)
        {
            ProductCategory data = await _db.ProductCategories.FindAsync(id);

            if (data is null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<ProductCategory, ProductCategoryEditResource>(data));
        }

        // PUT: api/ProductCategoryAPI/5
        public async Task<IHttpActionResult> PutAsync(int id, ProductCategoryEditResource resource)
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

            ProductCategory data = await _db.ProductCategories.FindAsync(id);

            if (data is null)
            {
                return NotFound();
            }

            _mapper.Map(resource, data);
            StringService stringService = new StringService();
            data.Slug = stringService.GenerateSlug(data.Name);
            // Logs
            data.ModifyUser = User.Identity.GetUserId();
            data.ModifyTime = DateTime.Now;

            _db.Entry(data).State = EntityState.Modified;

            // Delete Old Images
            IQueryable<ProductCategoryImage> oldImages = _db.ProductCategoryImages.Where(p => p.CategoryId == data.Id);
            _db.ProductCategoryImages.RemoveRange(oldImages);

            // Add New Images
            List<ProductCategoryImage> images = new List<ProductCategoryImage>();
            foreach (string link in resource.Images)
            {
                images.Add(new ProductCategoryImage
                {
                    CategoryId = data.Id,
                    Link = link
                });
            }
            _db.ProductCategoryImages.AddRange(images);

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

        // POST: api/ProductCategoryAPI
        public async Task<IHttpActionResult> PostAsync(ProductCategoryCreateResource resource)
        {
            if (resource is null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ProductCategory data = _mapper.Map<ProductCategoryCreateResource, ProductCategory>(resource);
            StringService stringService = new StringService();
            data.Slug = stringService.GenerateSlug(data.Name);
            // Logs
            data.CreateUser = User.Identity.GetUserId();
            data.CreateTime = DateTime.Now;

            _db.ProductCategories.Add(data);

            try
            {
                await _db.SaveChangesAsync();

                // Add Media Links
                List<ProductCategoryImage> images = new List<ProductCategoryImage>();
                foreach (string link in resource.Images)
                {
                    images.Add(new ProductCategoryImage
                    {
                        CategoryId = data.Id,
                        Link = link
                    });
                }
                _db.ProductCategoryImages.AddRange(images);
                await _db.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }

            return Ok(data.Id);
        }

        // DELETE: api/ProductCategoryAPI/5
        public async Task<IHttpActionResult> DeleteAsync(int id)
        {
            ProductCategory data = await _db.ProductCategories.FindAsync(id);
            if (data is null)
            {
                return NotFound();
            }

            // Delete Images
            _db.ProductCategoryImages.RemoveRange(_db.ProductCategoryImages.Where(p => p.CategoryId == id));

            // Delete Category
            _db.ProductCategories.Remove(data);

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