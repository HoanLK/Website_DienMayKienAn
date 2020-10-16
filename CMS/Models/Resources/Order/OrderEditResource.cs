using System;
using System.Collections.Generic;

namespace CMS.Models.Resources.Order
{
    public class OrderEditResource
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }
        public double Amount { get; set; }
        public bool Gender { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Note { get; set; }
        public bool Processed { get; set; }
    }
}