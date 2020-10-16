using System.Collections.Generic;

namespace CMS.Models.ViewModels
{
    public class HomeViewModel
    {
        public ICollection<ProductCategoryViewModel> Categories { get; set; }
    }
}