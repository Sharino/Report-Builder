using System;
using System.Linq;
using AutoMapper;
using Contracts.DTO;
using Contracts.Responses;
using DataLayer.Base;
using Logging;
using Models.DTO;
using Models.Models;
using System.Collections.Generic;

namespace BussinessLogic.Handlers
{
    public class ReportComponentHandler : BaseHandler<ReportComponentDTO>
    {
        //TODO base handlers virtual methods that are overriden by reporthandler
        private ComponentRepository ComponentRepository;
        private Log Log;

        public ReportComponentHandler()
        {
            RegisterMappings();
            Log = new Log("ReportComponentHandler");
            ComponentRepository = new ComponentRepository();
        }

        public void RegisterMappings()
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

        public override ReportComponentResponse Add(ReportComponentDTO reportComponentDto)
        {
            try
            {
                ReportComponent reportComponent = Mapper.Map<ReportComponentDTO, ReportComponent>(reportComponentDto);
                int id = ComponentRepository.Add(reportComponent);
                reportComponentDto.Id = id;
                return new ReportComponentResponse(reportComponentDto);
            }
            catch (Exception exception)
            {
                Log.Error("Unable to add a Report Component. Error message: " + exception);
                return new ReportComponentResponse(new ErrorDTO(exception.ToString(), "Unable to add a new Report Component", DateTime.Now));
            }
        }

        public override ReportComponentResponse Get(int id)
        {
            try
            {
                var reportComponent = ComponentRepository.Get(id);
                ReportComponentDTO reportComponentDto = Mapper.Map<ReportComponent, ReportComponentDTO>(reportComponent);
                return new ReportComponentResponse(reportComponentDto);
            }
            catch (Exception exception)
            {
                return new ReportComponentResponse(new ErrorDTO(exception.ToString(),
                        "Unable to get a Report Component with Id " + id, DateTime.Now));
            }
        }

        public override ReportComponentResponse GetAll()
        {
            try
            {
                var reportComponents = ComponentRepository.GetAll().OrderBy(x => x.Id);
                IEnumerable<ReportComponentDTO> reportComponentDtos = Mapper.Map<IEnumerable<ReportComponent>, IEnumerable<ReportComponentDTO>>(reportComponents);
                return new ReportComponentResponse(reportComponentDtos.ToList());
            }
            catch (Exception exception)
            {
                return new ReportComponentResponse(new ErrorDTO(exception.ToString(), "Unable to get all Report Components", DateTime.Now));
            }
        }

        public override ReportComponentResponse Remove(int id)
        {
            try
            {
                ReportComponentDTO target = Mapper.Map<ReportComponent, ReportComponentDTO>(ComponentRepository.Get(id));
                ComponentRepository.Remove(id);
                return new ReportComponentResponse(target);
            }
            catch (Exception exception)
            {
                return new ReportComponentResponse(new ErrorDTO(exception.ToString(), "Unable to remove Report Component with id " + id, DateTime.Now));
            }
        }
    }
}