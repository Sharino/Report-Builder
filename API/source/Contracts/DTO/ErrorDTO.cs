using System;

namespace Contracts.DTO
{
    public class ErrorDto
    {
        public ErrorDto(string code, string message)
        {
            Code = code;
            Message = message;
            ErrorNum = DateTime.UtcNow.ToString("yyyy-MM-dd hh:mm:ss");
            //ErrorNum = errorNum.ToShortDateString() + " " + errorNum.ToLongTimeString();
        }

        public string Code { get; set; }
        public string Message { get; set; }
        public string ErrorNum { get; set; }
    }
}
