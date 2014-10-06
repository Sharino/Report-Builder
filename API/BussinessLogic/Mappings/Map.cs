using AutoMapper;
using Models.DTO;
using Models.Models;

namespace BussinessLogic.Mappings
{
    public static class Map
    {
        public static void MapReportComponents()
        {
            Mapper.CreateMap<ReportComponent, ReportComponentDTO>()
                .ForMember(dest => dest.Title,
                    m => m.MapFrom(src => src.Title))
                .ForMember(dest => dest.Id,
                    m => m.MapFrom(src => src.Id));

            Mapper.CreateMap<ReportComponentDTO, ReportComponent>()
                .ForMember(dest => dest.Title,
                    m => m.MapFrom(src => src.Title))
                .ForMember(dest => dest.Id,
                    m => m.MapFrom(src => src.Id));
        }
    }
}
