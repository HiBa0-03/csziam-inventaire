package ma.csziam.inventaire.Dto;

import lombok.Getter;
import lombok.Setter;
import ma.csziam.inventaire.Enums.StatutPresence;
import java.time.LocalDate;

@Getter
@Setter
public class InventaireResponseDTO {

    private Long id;

    private LocalDate dateVerification;

    private StatutPresence statutPresence;

    private String commentaire;

    private Long articleId;
    private String articleDesignation;

    private Long agentId;
    private String agentNom;

    private Long campagneId;
}
