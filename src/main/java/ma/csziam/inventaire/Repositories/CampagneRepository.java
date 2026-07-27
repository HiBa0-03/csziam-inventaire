package ma.csziam.inventaire.Repositories;

import ma.csziam.inventaire.Entities.CampagneInventaire;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CampagneRepository extends JpaRepository<CampagneInventaire, Long> {

   Optional<CampagneInventaire> findByAnnee(int annee);
}
