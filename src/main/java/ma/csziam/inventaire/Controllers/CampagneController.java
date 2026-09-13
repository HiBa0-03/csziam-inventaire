package ma.csziam.inventaire.Controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.CampagneRequestDTO;
import ma.csziam.inventaire.Dto.CampagneResponseDTO;
import ma.csziam.inventaire.Services.CampagneService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/campagnes")
@RequiredArgsConstructor
@Tag(
        name = "Campagnes d'inventaire",
        description = "Gestion des campagnes annuelles d'inventaire"
)
@SecurityRequirement(name = "bearerAuth")
public class CampagneController {

    private final CampagneService campagneService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Créer une campagne",
            description = "Permet à un administrateur de créer une nouvelle campagne d'inventaire."
    )
    public CampagneResponseDTO createCampagne(
            @RequestBody CampagneRequestDTO campagneRequestDTO) {

        return campagneService.creerCampagne(campagneRequestDTO);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    @Operation(
            summary = "Lister les campagnes",
            description = "Retourne la liste des campagnes d'inventaire."
    )
    public List<CampagneResponseDTO> findAllCampagnes() {

        return campagneService.findAllCampagnes();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    @Operation(
            summary = "Consulter une campagne",
            description = "Retourne les informations d'une campagne à partir de son identifiant."
    )
    public CampagneResponseDTO findCampagneById(
            @Parameter(
                    description = "Identifiant de la campagne",
                    example = "1"
            )
            @PathVariable Long id) {

        return campagneService.findCampagneById(id);
    }

    @GetMapping("/annee/{annee}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    @Operation(
            summary = "Rechercher une campagne par année",
            description = "Retourne la campagne d'inventaire correspondant à une année donnée."
    )
    public CampagneResponseDTO findCampagneByYear(
            @Parameter(
                    description = "Année de la campagne",
                    example = "2026"
            )
            @PathVariable int annee) {

        return campagneService.findCampagneByYear(annee);
    }
}