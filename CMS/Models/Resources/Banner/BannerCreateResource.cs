namespace CMS.Models.Resources.Banner
{
    public class BannerCreateResource
    {
        public string MainTitle { get; set; }
        public string SubTitle { get; set; }
        public string Content { get; set; }
        public string TextButton { get; set; }
        public string Link { get; set; }
        public string Image { get; set; }
        public bool Published { get; set; }
        public int SortOrder { get; set; }
        public string Note { get; set; }
    }
}