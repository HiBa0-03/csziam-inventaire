package ma.csziam.inventaire.Repositories;

import ma.csziam.inventaire.Entities.Article;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleRepository extends JpaRepository<Article, Long> {

}
