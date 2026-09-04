package ma.csziam.inventaire.Repositories;

import ma.csziam.inventaire.Entities.Laboratoire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LaboratoireRepository extends JpaRepository<Laboratoire, Long> {
    Optional<Laboratoire> findByNom(String nom);
}
