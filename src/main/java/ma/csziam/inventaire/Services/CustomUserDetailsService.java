package ma.csziam.inventaire.Services;

import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Entities.Utilisateur;
import ma.csziam.inventaire.Repositories.UtilisateurRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UtilisateurRepository utilisateurRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {


        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));


        return User.builder()
                .username(utilisateur.getEmail())
                .password(utilisateur.getMotDePasse())
                .authorities(
                        new SimpleGrantedAuthority(
                                "ROLE_" + utilisateur.getRoleUtilisateur().name()
                        )
                )
                .build();

    }
}