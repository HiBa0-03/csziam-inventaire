package ma.csziam.inventaire.Services;

import ma.csziam.inventaire.Dto.RapportStatistiquesDTO;

public interface RapportService {

    RapportStatistiquesDTO calculerStatistiques();

    String genererRapport();
    String getDernierRapport();

}