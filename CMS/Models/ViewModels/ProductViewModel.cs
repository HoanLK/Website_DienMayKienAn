using System.Collections.Generic;

namespace CMS.Models.ViewModels
{
    public class ProductViewModel
    {
        public Product Product { get; set; }
        public List<PriceProductViewModel> Prices { get; set; }
        public List<FieldValueViewModel> TechInfos { get; set; }
    }
}