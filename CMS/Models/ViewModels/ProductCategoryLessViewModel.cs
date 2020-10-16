using System.Collections.Generic;

namespace CMS.Models.ViewModels
{
    public class ProductCategoryLessViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public int CountImageBanner { get; set; }
        public string Icon { get; set; }
        public string Slug { get; set; }
        public string SEO_Title { get; set; }
        public string SEO_Description { get; set; }
        public string SEO_Keywords { get; set; }
        public string SEO_Image { get; set; }
        public bool Featured { get; set; }
        public int SortOrder { get; set; }
        public ICollection<ProductCategoryImageLessViewModel> ProductCategoryImages { get; set; }
    }
}