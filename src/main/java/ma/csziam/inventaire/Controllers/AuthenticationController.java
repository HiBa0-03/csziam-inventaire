package ma.csziam.inventaire.Controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.AuthenticationRequestDTO;
import ma.csziam.inventaire.Dto.AuthenticationResponseDTO;
import ma.csziam.inventaire.Dto.RegisterRequestDTO;
import ma.csziam.inventaire.Dto.UtilisateurResponseDTO;
import ma.csziam.inventaire.Services.AuthenticationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(
        name = "Authentification",
        description = "Gestion de l'authentification et de l'utilisateur connecté"
)
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "Inscrire un utilisateur",
            description = "Permet de créer un compte utilisateur. L'accès est réservé aux administrateurs selon les règles de sécurité."
    )
    @SecurityRequirement(name = "bearerAuth")
    public AuthenticationResponseDTO register(
            @RequestBody RegisterRequestDTO request) {

        return authenticationService.register(request);
    }

    @PostMapping("/login")
    @Operation(
            summary = "Se connecter",
            description = "Authentifie un utilisateur et retourne un token JWT."
    )
    public AuthenticationResponseDTO login(
            @RequestBody AuthenticationRequestDTO request) {

        return authenticationService.login(request);
    }

    @GetMapping("/current")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
            summary = "Consulter l'utilisateur connecté",
            description = "Retourne les informations de l'utilisateur actuellement authentifié."
    )
    public UtilisateurResponseDTO getCurrentUser() {
        return authenticationService.getCurrentUser();
    }
}