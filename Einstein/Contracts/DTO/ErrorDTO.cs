using System;
namespace Contracts.DTO
{
    public class ErrorDto
    {
        public ErrorDto(string code, string message, DateTime errorNum)
        {
            Code = code;
            Message = message;
            ErrorNum = errorNum.ToShortDateString() + " " + errorNum.ToLongTimeString();
        }
        public string Code { get; set; }
        public string Message { get; set; }
        public string ErrorNum { get; set; }
    }
}