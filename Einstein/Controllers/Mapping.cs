using Contracts.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Controllers
{
    public class Mapping
    {
        public EinsteinComponentDTO ComponentToEinstein(ReportComponentDTO dto) 
        {
            var destination = new EinsteinComponentDTO();

            destination.Metrics = dto.Metrics;
            destination.Title = dto.Title;
            destination.Type = dto.Type;
            destination.Dimensions = dto.Dimensions;
            destination.Id = dto.Id;
            destination.Filters = dto.Filters;

            return destination;
        }

        public List<EinsteinComponentDTO> ComponentToEinstein(List <ReportComponentDTO> dto)
        {
            var destination = new List<EinsteinComponentDTO>();

            foreach (var component in dto) 
            {
                destination.Add(ComponentToEinstein(component));
            }

            return destination;
        }
    }
}
