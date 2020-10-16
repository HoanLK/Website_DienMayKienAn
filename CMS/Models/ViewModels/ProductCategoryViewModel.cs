using System.Collections.Generic;

namespace CMS.Models.ViewModels
{
    public class ProductCategoryViewModel
    {
        public ProductCategoryLessViewModel Category { get; set; }
        public ICollection<ProductLessViewModel> Products { get; set; }
        public ICollection<BrandLessModel> Brands { get; set; }
    }
}