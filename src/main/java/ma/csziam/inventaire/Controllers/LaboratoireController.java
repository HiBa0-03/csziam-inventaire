package ma.csziam.inventaire.Controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.LaboratoireRequestDTO;
import ma.csziam.inventaire.Dto.LaboratoireResponseDTO;
import ma.csziam.inventaire.Services.LaboratoireService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/laboratoires")
@RequiredArgsConstructor
@Tag(
        name = "Laboratoires",
        description = "Gestion des laboratoires du Centre CSZIAM"
)
@SecurityRequirement(name = "bearerAuth")
public class LaboratoireController {

    private final LaboratoireService laboratoireService;

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    @Operation(
            summary = "Consulter un laboratoire",
            description = "Retourne les informations d'un laboratoire à partir de son identifiant."
    )
    public LaboratoireResponseDTO getLaboratoire(
            @Parameter(
                    description = "Identifiant du laboratoire",
                    example = "1"
            )
            @PathVariable Long id) {

        return laboratoireService.findLaboratoireById(id);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    @Operation(
            summary = "Lister les laboratoires",
            description = "Retourne la liste des laboratoires enregistrés."
    )
    public List<LaboratoireResponseDTO> getAllLaboratoires() {

        return laboratoireService.findAllLaboratoires();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Créer un laboratoire",
            description = "Permet à un administrateur de créer un nouveau laboratoire."
    )
    public LaboratoireResponseDTO createLaboratoire(
            @Valid @RequestBody LaboratoireRequestDTO request) {

        return laboratoireService.createLaboratoire(request);
    }
}