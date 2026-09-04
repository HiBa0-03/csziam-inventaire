package ma.csziam.inventaire.Dto;


import lombok.*;
import ma.csziam.inventaire.Enums.EtatArticle;

import java.time.LocalDate;

@Getter
@Setter

public class ArticleResponseDTO {

    private Long id;

    private String designation;

    private String numeroInventaire;

    private EtatArticle etat;

    private LocalDate dateAcquisition;

    private Double valeur;

    private Long categorieId;
    private String categorieNom;

    private Long laboratoireId;

    private Long serviceId;

    private String affectation;
}
