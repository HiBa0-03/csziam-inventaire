package ma.csziam.inventaire.Controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.MouvementRequestDTO;
import ma.csziam.inventaire.Dto.MouvementResponseDTO;
import ma.csziam.inventaire.Services.MouvementService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mouvements")
@RequiredArgsConstructor
@Tag(
        name = "Mouvements",
        description = "Gestion des mouvements des articles du patrimoine"
)
@SecurityRequirement(name = "bearerAuth")
public class MouvementController {

    private final MouvementService mouvementService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Enregistrer un mouvement",
            description = "Permet à un administrateur d'enregistrer un nouveau mouvement concernant un article."
    )
    public MouvementResponseDTO createMouvement(
            @RequestBody MouvementRequestDTO request) {

        return mouvementService.creeMouvement(request);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE')")
    @Operation(
            summary = "Lister les mouvements",
            description = "Retourne la liste des mouvements enregistrés dans le système."
    )
    public List<MouvementResponseDTO> getAllMouvements() {

        return mouvementService.findAllMouvements();
    }
}