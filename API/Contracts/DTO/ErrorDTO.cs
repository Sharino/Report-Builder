using System;

namespace Contracts.DTO
{
    public class ErrorDTO
    {
        public ErrorDTO(string code, string message, string errorNum)
        {
            Code = code;
            Message = message;
            ErrorNum = errorNum;
        }

        public ErrorDTO(string code, string message, DateTime errorNum)
        {
            Code = code;
            Message = message;
            ErrorNum = errorNum.ToLongTimeString();
        }

        public string Code { get; set; }
        public string Message { get; set; }
        public string ErrorNum { get; set; }
    }
}
