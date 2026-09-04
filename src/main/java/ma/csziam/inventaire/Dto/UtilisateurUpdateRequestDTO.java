package ma.csziam.inventaire.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import ma.csziam.inventaire.Enums.RoleUtilisateur;

@Getter
@Setter
public class UtilisateurUpdateRequestDTO {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @Email(message = "Email invalide")
    @NotBlank(message = "L'email est obligatoire")
    private String email;

    private String motDePasse;

    private String telephone;

    @NotNull
    private RoleUtilisateur roleUtilisateur;

    private Long laboratoireId;

    private Long serviceId;
}