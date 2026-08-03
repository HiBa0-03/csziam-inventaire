package ma.csziam.inventaire.Dto;
import lombok.Getter;
import lombok.Setter;
import ma.csziam.inventaire.Enums.RoleUtilisateur;

@Getter
@Setter
public class RegisterRequestDTO {
    private String nom;

    private String email;

    private String motDePasse;

    private String telephone;

    private RoleUtilisateur roleUtilisateur;
}
