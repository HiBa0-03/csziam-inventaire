package ma.csziam.inventaire.Dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import ma.csziam.inventaire.Enums.TypeMouvement;

import java.time.LocalDate;
@Getter
@Setter

public class MouvementResponseDTO {

    private Long id;

    private LocalDate date;

    private TypeMouvement typeMouvement;

    private String motif;

    private String ancienneLocalisation;

    private String nouvelleLocalisation;

    private Long articleId;

    private Long laboratoireId;

    private Long serviceId;

//    private Long utilisateurId;

}
