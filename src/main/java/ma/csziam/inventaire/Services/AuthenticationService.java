package ma.csziam.inventaire.Services;

import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.AuthenticationRequestDTO;
import ma.csziam.inventaire.Dto.AuthenticationResponseDTO;
import ma.csziam.inventaire.Dto.RegisterRequestDTO;
import ma.csziam.inventaire.Dto.UtilisateurResponseDTO;
import ma.csziam.inventaire.Entities.Utilisateur;
import ma.csziam.inventaire.Repositories.UtilisateurRepository;
import ma.csziam.inventaire.Security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UtilisateurRepository utilisateurRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    public AuthenticationResponseDTO register(RegisterRequestDTO request) {

        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email déjà utilisé");
        }

        Utilisateur utilisateur = Utilisateur.builder()
                .nom(request.getNom())
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .telephone(request.getTelephone())
                .roleUtilisateur(request.getRoleUtilisateur())
                .build();

        utilisateurRepository.save(utilisateur);
        String jwt = jwtService.generateToken(utilisateur);


        return new AuthenticationResponseDTO(jwt);
    }

    public AuthenticationResponseDTO login(AuthenticationRequestDTO request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getMotDePasse()
                )
        );
        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        String jwt = jwtService.generateToken(utilisateur);

        return new AuthenticationResponseDTO(jwt);
    }

    public UtilisateurResponseDTO getCurrentUser() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        UtilisateurResponseDTO dto = new UtilisateurResponseDTO();

        dto.setId(utilisateur.getId());
        dto.setNom(utilisateur.getNom());
        dto.setEmail(utilisateur.getEmail());
        dto.setTelephone(utilisateur.getTelephone());
        dto.setRoleUtilisateur(utilisateur.getRoleUtilisateur());

        return dto;
    }

}