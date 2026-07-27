package ma.csziam.inventaire.Dto;

import lombok.Getter;
import lombok.Setter;
import ma.csziam.inventaire.Enums.StatutInventaire;

import java.time.LocalDate;

@Getter
@Setter
public class CampagneResponseDTO  {

    private Long id;

    private int annee;

    private LocalDate dateDebut;

    private LocalDate dateFin;

    private StatutInventaire statut;


}
