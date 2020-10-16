namespace CMS.Models.ViewModels
{
    public class PriceProductViewModel
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Slug { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public bool IsCurrent { get; set; }
    }
}