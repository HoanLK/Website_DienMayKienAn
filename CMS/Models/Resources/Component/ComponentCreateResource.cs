using System;
using System.Collections.Generic;

namespace CMS.Models.Resources.Component
{
    public class ComponentCreateResource
    {
        public Nullable<int> ModuleId { get; set; }
        public string Name { get; set; }
        public string MainTitle { get; set; }
        public string SubTitle { get; set; }
        public string Content { get; set; }
        public string Link { get; set; }
        public string TextButton { get; set; }
        public string EN_MainTitle { get; set; }
        public string EN_SubTitle { get; set; }
        public string EN_Content { get; set; }
        public string EN_Link { get; set; }
        public string EN_TextButton { get; set; }
        public bool IsSingleMedia { get; set; }
        public string LinkMedia { get; set; }
        public string AnimateIn { get; set; }
        public string AnimateOut { get; set; }
        public double Timeout { get; set; }
        public string Icon { get; set; }
        public bool Published { get; set; }
        public int SortOrder { get; set; }
        public string Note { get; set; }

        public List<string> Images { get; set; }
    }
}