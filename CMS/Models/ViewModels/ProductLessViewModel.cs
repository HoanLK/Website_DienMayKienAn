namespace CMS.Models.ViewModels
{
    public class ProductLessViewModel
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public int CategoryId { get; set; }
        public int? BrandId { get; set; }
        public string Name { get; set; }
        public int Type { get; set; }
        public double Price { get; set; }
        public double OldPrice { get; set; }
        public string Image { get; set; }
        public string ThumbImage { get; set; }
        public string Slug { get; set; }
        public int SortOrder { get; set; }
        public double Views { get; set; }
    }
}