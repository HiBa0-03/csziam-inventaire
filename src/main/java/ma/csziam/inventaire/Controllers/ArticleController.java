package ma.csziam.inventaire.Controllers;
import ma.csziam.inventaire.Dto.ArticleResponseDTO;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

import ma.csziam.inventaire.Dto.ArticleRequestDTO;
import ma.csziam.inventaire.Services.ArticleService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/articles")
@RequiredArgsConstructor
public class ArticleController {
    private final ArticleService articleService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ArticleResponseDTO creeArticle(@RequestBody ArticleRequestDTO dto) {
        return articleService.creeArticle(dto);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    public List<ArticleResponseDTO> findAll() {
        return articleService.findAllArticles();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    public ArticleResponseDTO findById(@PathVariable Long id) {
        return articleService.findArticleById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ArticleResponseDTO updateArticle(@PathVariable Long id, @RequestBody ArticleRequestDTO dto) {
        return articleService.modifierArticle(id, dto);
    }
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
    public void deleteArticle(@PathVariable Long id) {
         articleService.supprimerArticleByID(id);
  }

}
