package ma.csziam.inventaire.Repositories;

import ma.csziam.inventaire.Entities.Mouvement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MouvementRepository extends JpaRepository<Mouvement, Long> {

}
