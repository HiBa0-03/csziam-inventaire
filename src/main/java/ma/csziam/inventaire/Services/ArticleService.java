package ma.csziam.inventaire.Services;

import ma.csziam.inventaire.Dto.ArticleRequestDTO;
import ma.csziam.inventaire.Dto.ArticleResponseDTO;
import ma.csziam.inventaire.Entities.Article;

import java.util.List;

public interface ArticleService {
    List< ArticleResponseDTO> findAllArticles();
    ArticleResponseDTO findArticleById(Long id);
    ArticleResponseDTO creeArticle(ArticleRequestDTO dto);
    ArticleResponseDTO modifierArticle(Long id,ArticleRequestDTO dto);
    void supprimerArticleByID(Long id);


}
