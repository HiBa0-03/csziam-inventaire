package ma.csziam.inventaire.Dto;

import ma.csziam.inventaire.Enums.RoleUtilisateur;
import lombok.*;
@Getter
@Setter
public class UtilisateurResponseDTO {


        private Long id;

        private String nom;

        private String email;

        private String telephone;

        private RoleUtilisateur roleUtilisateur;

    }

