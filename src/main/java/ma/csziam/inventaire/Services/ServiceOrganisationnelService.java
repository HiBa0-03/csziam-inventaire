package ma.csziam.inventaire.Services;

import ma.csziam.inventaire.Dto.ServiceResponseDTO;

import java.util.List;

public interface ServiceOrganisationnelService {
    List<ServiceResponseDTO> findAllServices();
    ServiceResponseDTO findServicesById(Long id);
}
