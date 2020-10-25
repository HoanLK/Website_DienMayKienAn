using CMS.Models;
using CMS.Services;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace CMS.APIs
{
    [Authorize]
    public class ProductCloneAPIController : ApiController
    {
        private readonly CMSEntities _db = new CMSEntities();

        public ProductCloneAPIController() { }

        // GET: api/ProductCloneAPI/5
        public async Task<IHttpActionResult> GetAsync(int id)
        {
            var product = await _db.Products.AsNoTracking()
                                            .Where(p => p.Id == id)
                                            .Include(p => p.ProductImages)
                                            .FirstOrDefaultAsync();
            if (product == null)
            {
                return NotFound();
            }
            StringService stringService = new StringService();
            Product newProduct = new Product()
            {
                Id = product.Id,
                BrandId = product.BrandId,
                CategoryId = product.CategoryId,
                Code = product.Code,
                Content = product.Content,
                CreateTime = DateTime.Now,
                CreateUser = User.Identity.Name,
                Description = product.Description,
                EN_Content = product.EN_Content,
                EN_Description = product.EN_Description,
                EN_Name = product.EN_Name,
                Feature = product.Feature,
                Featured = product.Featured,
                GroupId = product.GroupId,
                Image = product.Image,
                ImageBanner = product.ImageBanner,
                Name = product.Name + " Copy",
                Note = product.Note,
                OldPrice = product.OldPrice,
                Price = product.Price,
                Published = product.Published,
                SEO_Description = product.SEO_Description,
                SEO_Image = product.SEO_Image,
                SEO_Keywords = product.SEO_Keywords,
                SEO_Title = product.SEO_Title,
                Slug = stringService.GenerateSlug(product.Name + " Copy"),
                SortOrder = product.SortOrder,
                Tags = product.Tags,
                Orders = product.Orders,
                ThumbImage = product.ThumbImage,
                Type = product.Type
            };
            _db.Products.Add(newProduct);

            try
            {
                await _db.SaveChangesAsync();

                // Add Media Links
                List<ProductImage> images = new List<ProductImage>();
                foreach (var image in product.ProductImages)
                {
                    images.Add(new ProductImage
                    {
                        ProductId = newProduct.Id,
                        Link = image.Link
                    });
                }
                _db.ProductImages.AddRange(images);
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