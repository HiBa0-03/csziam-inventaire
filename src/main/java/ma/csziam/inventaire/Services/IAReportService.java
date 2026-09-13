package ma.csziam.inventaire.Services;

import ma.csziam.inventaire.Dto.RapportStatistiquesDTO;

public interface IAReportService {

    String genererRapport(RapportStatistiquesDTO statistiques);
}