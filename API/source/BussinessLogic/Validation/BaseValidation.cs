
using Models.DTO;
using Models.Models;

namespace BussinessLogic.Validation
{
    public static class BaseValidation
    {
        public static bool IsValid(ReportComponent reportComponent)
        {
            if (reportComponent != null)
                return true;
            return false;
        }

        public static bool IsValid(ReportComponentDTO reportComponentDto)
        {
            if (reportComponentDto != null)
                return true;
            return false;
        }
    }
}
