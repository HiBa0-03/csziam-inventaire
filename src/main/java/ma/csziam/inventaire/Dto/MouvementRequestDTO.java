package ma.csziam.inventaire.Dto;

import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import ma.csziam.inventaire.Entities.Utilisateur;
import ma.csziam.inventaire.Enums.TypeMouvement;

import java.time.LocalDate;

@Setter
@Getter


public class MouvementRequestDTO {

    private LocalDate date;

    private TypeMouvement typeMouvement;

    private String motif;

    @NotBlank(message = "ancienne Localisation est obligatoire")
    private String ancienneLocalisation;

    @NotBlank(message = " nouvelle Localisation est obligatoire")
    private String nouvelleLocalisation;

    private Long articleId;

    private Long laboratoireId;

    private Long serviceId;

}
