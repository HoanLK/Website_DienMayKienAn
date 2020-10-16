using System.Text;
using System.Text.RegularExpressions;

namespace CMS.Services
{
    public class StringService
    {
        public string ConvertToUnSign(string input)
        {
            string output = input.Normalize(NormalizationForm.FormD);
            StringBuilder sb = new StringBuilder();
            for (int ich = 0; ich < output.Length; ich++)
            {
                System.Globalization.UnicodeCategory uc = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(output[ich]);
                if (uc != System.Globalization.UnicodeCategory.NonSpacingMark)
                {
                    sb.Append(output[ich]);
                }
            }
            sb = sb.Replace('Đ', 'D');
            sb = sb.Replace('đ', 'd');
            return (sb.ToString().Normalize(NormalizationForm.FormD));
        }

        public string GenerateSlug(string input)
        {
            string ouput = ConvertToUnSign(input);

            //First to lower case
            ouput = ouput.ToLowerInvariant();

            //Replace spaces
            ouput = Regex.Replace(ouput, @"\s", "-", RegexOptions.Compiled);

            //Remove invalid chars
            ouput = Regex.Replace(ouput, @"[^a-z0-9\s-_]", "", RegexOptions.Compiled);

            //Trim dashes from end
            ouput = ouput.Trim('-', '_');

            //Replace double occurences of - or _
            ouput = Regex.Replace(ouput, @"([-_]){2,}", "$1", RegexOptions.Compiled);

            return ouput;
        }
    }
}