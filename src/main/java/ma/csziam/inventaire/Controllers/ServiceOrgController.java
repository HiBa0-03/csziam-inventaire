package ma.csziam.inventaire.Controllers;

import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.ServiceResponseDTO;
import ma.csziam.inventaire.Services.ServiceOrganisationnelService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
@RequiredArgsConstructor
public class ServiceOrgController {
   final private ServiceOrganisationnelService serviceOrganisationnelService;
    @GetMapping("/{id}")
    public ServiceResponseDTO GetServiceByid(@PathVariable Long id) {
        return serviceOrganisationnelService.findServicesById(id);
    }
    @GetMapping
    public List< ServiceResponseDTO> GetAllLServices() {
        return serviceOrganisationnelService.findAllServices();
    }
}

