using System.Collections.Generic;

namespace CMS.Models.ViewModels
{
    public class SearchViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<ProductLessViewModel> Products { get; set; }
    }
}