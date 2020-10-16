using AutoMapper;
using CMS.Models;
using CMS.Models.Resources.Order;
using DevExtreme.AspNet.Data;
using Microsoft.AspNet.Identity;
using System;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Web.Http;

namespace CMS.APIs
{
    [Authorize]
    public class OrderAPIController : ApiController
    {
        private readonly CMSEntities _db = new CMSEntities();
        private readonly Mapper _mapper;

        public OrderAPIController()
        {
            // MAPPER
            var config = new MapperConfiguration(
                cfg =>
                {
                    // Create
                    cfg.CreateMap<OrderCreateResource, Order>();
                    // Edit
                    cfg.CreateMap<OrderEditResource, Order>();
                    cfg.CreateMap<Order, OrderEditResource>();
                }
            );
            _mapper = new Mapper(config);
        }

        // GET: api/OrderAPI
        public object Gets(DataSourceLoadOptions loadOptions)
        {
            if (loadOptions is null)
            {
                return BadRequest();
            }

            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(_db.Orders, loadOptions);
        }

        // GET: api/OrderAPI/5
        public async Task<IHttpActionResult> GetAsync(int id)
        {
            Order data = await _db.Orders.FindAsync(id);
            if (data is null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<Order, OrderEditResource>(data));
        }

        // PUT: api/OrderAPI/5
        public async Task<IHttpActionResult> PutAsync(int id, OrderEditResource resource)
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

            Order data = await _db.Orders.FindAsync(id);

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

        // POST: api/OrderAPI
        [AllowAnonymous]
        public async Task<IHttpActionResult> PostAsync(OrderCreateResource resource)
        {
            if (resource is null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Order data = _mapper.Map<OrderCreateResource, Order>(resource);
            data.CreateUser = User.Identity.GetUserId();
            data.CreateTime = DateTime.Now;

            _db.Orders.Add(data);

            try
            {
                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }

            return Ok(data.Id);
        }

        // DELETE: api/OrderAPI/5
        public async Task<IHttpActionResult> DeleteAsync(int id)
        {
            Order data = await _db.Orders.FindAsync(id);
            if (data is null)
            {
                return NotFound();
            }

            // Delete Order
            _db.Orders.Remove(data);

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