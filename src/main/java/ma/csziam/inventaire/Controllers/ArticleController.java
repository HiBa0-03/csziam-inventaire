package ma.csziam.inventaire.Controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.ArticleRequestDTO;
import ma.csziam.inventaire.Dto.ArticleResponseDTO;
import ma.csziam.inventaire.Services.ArticleService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/articles")
@RequiredArgsConstructor
@Tag(
        name = "Articles",
        description = "Gestion des articles du patrimoine du Centre CSZIAM"
)
@SecurityRequirement(name = "bearerAuth")
public class ArticleController {

    private final ArticleService articleService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Créer un article",
            description = "Permet à un administrateur d'ajouter un nouvel article au patrimoine."
    )
    public ArticleResponseDTO creeArticle(
            @RequestBody ArticleRequestDTO dto) {

        return articleService.creeArticle(dto);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    @Operation(
            summary = "Lister les articles",
            description = "Retourne la liste des articles enregistrés dans le patrimoine."
    )
    public List<ArticleResponseDTO> findAll() {

        return articleService.findAllArticles();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    @Operation(
            summary = "Consulter un article",
            description = "Retourne les informations d'un article à partir de son identifiant."
    )
    public ArticleResponseDTO findById(
            @Parameter(
                    description = "Identifiant de l'article",
                    example = "1"
            )
            @PathVariable Long id) {

        return articleService.findArticleById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Modifier un article",
            description = "Permet à un administrateur de modifier les informations d'un article existant."
    )
    public ArticleResponseDTO updateArticle(
            @Parameter(
                    description = "Identifiant de l'article",
                    example = "1"
            )
            @PathVariable Long id,
            @RequestBody ArticleRequestDTO dto) {

        return articleService.modifierArticle(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Supprimer un article",
            description = "Permet à un administrateur de supprimer un article du patrimoine."
    )
    public void deleteArticle(
            @Parameter(
                    description = "Identifiant de l'article",
                    example = "1"
            )
            @PathVariable Long id) {

        articleService.supprimerArticleByID(id);
    }
}