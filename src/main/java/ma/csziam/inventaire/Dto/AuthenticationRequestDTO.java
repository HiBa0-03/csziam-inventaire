package ma.csziam.inventaire.Dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthenticationRequestDTO {
    private String email;

    private String motDePasse;
}
