package ma.csziam.inventaire.Dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter

public class ArticleRequestDTO {

    private String designation;

    private String numeroInventaire;

    private String etat;

    private LocalDate dateAcquisition;

    private Double valeur;

    private Long categorieId;

    private Long laboratoireId;

    private Long serviceId;

}
