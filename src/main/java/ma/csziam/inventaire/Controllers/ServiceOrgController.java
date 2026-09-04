package ma.csziam.inventaire.Controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.ServiceRequestDTO;
import ma.csziam.inventaire.Dto.ServiceResponseDTO;
import ma.csziam.inventaire.Services.ServiceOrganisationnelService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
@RequiredArgsConstructor
public class ServiceOrgController {
   final private ServiceOrganisationnelService serviceOrganisationnelService;
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    public ServiceResponseDTO GetServiceByid(@PathVariable Long id) {
        return serviceOrganisationnelService.findServicesById(id);
    }
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    public List< ServiceResponseDTO> GetAllLServices() {

        return serviceOrganisationnelService.findAllServices();
    }
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ServiceResponseDTO createService(@Valid @RequestBody ServiceRequestDTO request) {
        return serviceOrganisationnelService.createService(request);
    }
}

