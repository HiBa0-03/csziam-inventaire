package ma.csziam.inventaire.Repositories;

import ma.csziam.inventaire.Entities.Inventaire;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventaireRepository extends JpaRepository<Inventaire, Long> {

    Optional<Inventaire> findByArticleIdAndCampagneId(Long articleId, Long campagneId);
    List<Inventaire> findByCampagneId(Long campagneId);
    long countByCampagneId(Long campagneId);

}
