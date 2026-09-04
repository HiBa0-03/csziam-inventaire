package ma.csziam.inventaire.Controllers;

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
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthenticationResponseDTO register(@RequestBody RegisterRequestDTO request) {
        return authenticationService.register(request);
    }

    @PostMapping("/login")
    public AuthenticationResponseDTO login(@RequestBody AuthenticationRequestDTO request) {
        return authenticationService.login(request);
    }

    @GetMapping("/current")
    public UtilisateurResponseDTO getCurrentUser() {
        return authenticationService.getCurrentUser();
    }

}