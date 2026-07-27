package ma.csziam.inventaire.Dto;

import ma.csziam.inventaire.Enums.RoleUtilisateur;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
public class UtilisateurRequestDTO {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @Email(message = "Email invalide")
    @NotBlank(message = "L'email est obligatoire")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    private String motDePasse;

    private String telephone;

    private RoleUtilisateur roleUtilisateur;

}