package ma.csziam.inventaire.Controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(
        name = "Services organisationnels",
        description = "Gestion des services organisationnels du Centre CSZIAM"
)
@SecurityRequirement(name = "bearerAuth")
public class ServiceOrgController {

    private final ServiceOrganisationnelService serviceOrganisationnelService;

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    @Operation(
            summary = "Consulter un service",
            description = "Retourne les informations d'un service organisationnel à partir de son identifiant."
    )
    public ServiceResponseDTO GetServiceByid(
            @Parameter(
                    description = "Identifiant du service",
                    example = "1"
            )
            @PathVariable Long id) {

        return serviceOrganisationnelService.findServicesById(id);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    @Operation(
            summary = "Lister les services",
            description = "Retourne la liste des services organisationnels."
    )
    public List<ServiceResponseDTO> GetAllLServices() {

        return serviceOrganisationnelService.findAllServices();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Créer un service",
            description = "Permet à un administrateur de créer un nouveau service organisationnel."
    )
    public ServiceResponseDTO createService(
            @Valid @RequestBody ServiceRequestDTO request) {

        return serviceOrganisationnelService.createService(request);
    }
}