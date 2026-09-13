package ma.csziam.inventaire.Controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.CategorieRequestDTO;
import ma.csziam.inventaire.Dto.CategorieResponseDTO;
import ma.csziam.inventaire.Services.CategorieService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@Tag(
        name = "Catégories",
        description = "Gestion des catégories des articles du patrimoine"
)
@SecurityRequirement(name = "bearerAuth")
public class CategorieController {

    private final CategorieService categorieService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Créer une catégorie",
            description = "Permet à un administrateur de créer une nouvelle catégorie d'articles."
    )
    public CategorieResponseDTO createCategorie(
            @RequestBody CategorieRequestDTO dto) {

        return categorieService.creeCategorie(dto);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    @Operation(
            summary = "Lister les catégories",
            description = "Retourne la liste des catégories d'articles."
    )
    public List<CategorieResponseDTO> findAllCategories() {

        return categorieService.findAllCategories();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    @Operation(
            summary = "Consulter une catégorie",
            description = "Retourne les informations d'une catégorie à partir de son identifiant."
    )
    public CategorieResponseDTO findCategorieById(
            @Parameter(
                    description = "Identifiant de la catégorie",
                    example = "1"
            )
            @PathVariable Long id) {

        return categorieService.findCategorieById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Modifier une catégorie",
            description = "Permet à un administrateur de modifier une catégorie existante."
    )
    public CategorieResponseDTO updateCategorie(
            @Parameter(
                    description = "Identifiant de la catégorie",
                    example = "1"
            )
            @PathVariable Long id,
            @RequestBody CategorieRequestDTO dto) {

        return categorieService.updateCategorieById(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Supprimer une catégorie",
            description = "Permet à un administrateur de supprimer une catégorie existante."
    )
    public void deleteCategorie(
            @Parameter(
                    description = "Identifiant de la catégorie",
                    example = "1"
            )
            @PathVariable Long id) {

        categorieService.deleteCategorieById(id);
    }
}