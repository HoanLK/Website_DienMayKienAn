using System.Collections.Generic;

namespace CMS.Models.Resources.ProductCategory
{
    public class ProductCategoryCreateResource
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Content { get; set; }
        public string EN_Name { get; set; }
        public string EN_Description { get; set; }
        public string EN_Content { get; set; }
        public bool Published { get; set; }
        public bool Featured { get; set; }
        public string Icon { get; set; }
        public string Image { get; set; }
        public string ImageBanner { get; set; }
        public int CountImageBanner { get; set; }
        public string Tags { get; set; }
        public int SortOrder { get; set; }
        public string Note { get; set; }
        public string SEO_Title { get; set; }
        public string SEO_Description { get; set; }
        public string SEO_Keywords { get; set; }
        public string SEO_Image { get; set; }

        public List<string> Images { get; set; }
    }
}