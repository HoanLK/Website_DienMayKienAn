﻿using System;
using System.Collections.Generic;

namespace CMS.Models.Resources.Product
{
    public class ProductEditResource
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public int CategoryId { get; set; }
        public Nullable<int> GroupId { get; set; }
        public Nullable<int> BrandId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Feature { get; set; }
        public string Content { get; set; }
        public int Type { get; set; }
        public double Price { get; set; }
        public double OldPrice { get; set; }
        public string Prices { get; set; }
        public string EN_Name { get; set; }
        public string EN_Description { get; set; }
        public string EN_Content { get; set; }
        public bool Published { get; set; }
        public bool Featured { get; set; }
        public string Image { get; set; }
        public string ImageBanner { get; set; }
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