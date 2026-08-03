package ma.csziam.inventaire.Config;

import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Entities.Utilisateur;
import ma.csziam.inventaire.Enums.RoleUtilisateur;
import ma.csziam.inventaire.Repositories.UtilisateurRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
@RequiredArgsConstructor
public class DataInitializer {


    private final PasswordEncoder passwordEncoder;


    @Bean
    CommandLineRunner init(UtilisateurRepository utilisateurRepository) {

        return args -> {


            if(utilisateurRepository.findByEmail("admin3@csziam.ma").isEmpty()) {


                Utilisateur admin = Utilisateur.builder()
                        .nom("H")
                        .email("admin3@csziam.ma")
                        .motDePasse(passwordEncoder.encode("admin123"))
                        .telephone("0611111113")
                        .roleUtilisateur(RoleUtilisateur.ADMIN)
                        .build();


                utilisateurRepository.save(admin);

            }

        };
    }
}