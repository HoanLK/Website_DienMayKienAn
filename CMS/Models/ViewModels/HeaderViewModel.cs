﻿using System.Collections.Generic;

namespace CMS.Models.ViewModels
{
    public class HeaderViewModel
    {
        public Info Info { get; set; }
        public ICollection<ProductCategoryLessViewModel> Categories { get; set; }
    }
}