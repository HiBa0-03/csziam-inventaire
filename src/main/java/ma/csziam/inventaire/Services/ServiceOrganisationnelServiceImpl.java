package ma.csziam.inventaire.Services;

import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.ServiceRequestDTO;
import ma.csziam.inventaire.Dto.ServiceResponseDTO;
import ma.csziam.inventaire.Entities.ServiceOrganisationnel;
import ma.csziam.inventaire.Repositories.ServiceOrganisationnelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ServiceOrganisationnelServiceImpl implements ServiceOrganisationnelService {
    final private ServiceOrganisationnelRepository serviceRepository;

    @Override

    public List<ServiceResponseDTO> findAllServices()
    {
        List<ServiceOrganisationnel> serviceOrg = serviceRepository.findAll();
        return serviceOrg .stream()
                .map(service -> {
                    ServiceResponseDTO dto = new  ServiceResponseDTO();

                    dto.setId(service.getId());
                    dto.setNom(service .getNom());
                    dto.setDescription(service .getDescription());
                    return dto;

                })
                .toList();
    }
    @Override

    public ServiceResponseDTO findServicesById(Long id){
        ServiceOrganisationnel serviceOrganisationnel = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("service non trouvée"));
        ServiceResponseDTO dto = new ServiceResponseDTO();
        dto.setId(serviceOrganisationnel.getId());
        dto.setNom(serviceOrganisationnel.getNom());
        dto.setDescription(serviceOrganisationnel.getDescription());
        return dto;

    }
    @Override
    public ServiceResponseDTO createService(ServiceRequestDTO request) {

        ServiceOrganisationnel service = new ServiceOrganisationnel();

        service.setNom(request.getNom());
        service.setDescription(request.getDescription());

        ServiceOrganisationnel serviceSauvegarde =
                serviceRepository.save(service);

        ServiceResponseDTO dto = new ServiceResponseDTO();

        dto.setId(serviceSauvegarde.getId());
        dto.setNom(serviceSauvegarde.getNom());
        dto.setDescription(serviceSauvegarde.getDescription());

        return dto;
    }
}

