package ma.csziam.inventaire.Controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.InventaireRequestDTO;
import ma.csziam.inventaire.Dto.InventaireResponseDTO;
import ma.csziam.inventaire.Services.InventaireService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventaires")
@RequiredArgsConstructor
@Tag(
        name = "Inventaires",
        description = "Gestion des opérations d'inventaire des articles"
)
@SecurityRequirement(name = "bearerAuth")
public class InventaireController {

    private final InventaireService inventaireService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('AGENT_INVENTAIRE')")
    @Operation(
            summary = "Créer un inventaire",
            description = "Permet à un agent d'inventaire d'enregistrer une opération d'inventaire."
    )
    public InventaireResponseDTO creerInventaire(
            @RequestBody InventaireRequestDTO dto) {

        return inventaireService.creerInventaire(dto);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    @Operation(
            summary = "Lister les inventaires",
            description = "Retourne la liste des opérations d'inventaire enregistrées."
    )
    public List<InventaireResponseDTO> findAllInventaires() {

        return inventaireService.findAllInventaires();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    @Operation(
            summary = "Consulter un inventaire",
            description = "Retourne les informations d'une opération d'inventaire à partir de son identifiant."
    )
    public InventaireResponseDTO findInventaireById(
            @Parameter(
                    description = "Identifiant de l'inventaire",
                    example = "1"
            )
            @PathVariable Long id) {

        return inventaireService.findInventaireById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('AGENT_INVENTAIRE')")
    @Operation(
            summary = "Modifier un inventaire",
            description = "Permet à un agent d'inventaire de modifier une opération d'inventaire."
    )
    public InventaireResponseDTO modifierInventaire(
            @Parameter(
                    description = "Identifiant de l'inventaire",
                    example = "1"
            )
            @PathVariable Long id,
            @RequestBody InventaireRequestDTO dto) {

        return inventaireService.modifierInventaire(id, dto);
    }

    @GetMapping("/campagne/{campagneId}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    @Operation(
            summary = "Lister les inventaires d'une campagne",
            description = "Retourne les inventaires associés à une campagne d'inventaire donnée."
    )
    public List<InventaireResponseDTO> getInventairesByCampagne(
            @Parameter(
                    description = "Identifiant de la campagne",
                    example = "1"
            )
            @PathVariable Long campagneId) {

        return inventaireService.findInventairesByCampagne(campagneId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('AGENT_INVENTAIRE')")
    @Operation(
            summary = "Supprimer un inventaire",
            description = "Permet à un agent d'inventaire de supprimer une opération d'inventaire."
    )
    public void supprimerInventaire(
            @Parameter(
                    description = "Identifiant de l'inventaire",
                    example = "1"
            )
            @PathVariable Long id) {

        inventaireService.supprimerInventaire(id);
    }
}