package ma.csziam.inventaire.Repositories;

import ma.csziam.inventaire.Entities.ServiceOrganisationnel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServiceOrganisationnelRepository extends JpaRepository<ServiceOrganisationnel, Long> {
    Optional<ServiceOrganisationnel> findByNom(String nom);

}
