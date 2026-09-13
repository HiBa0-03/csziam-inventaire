package ma.csziam.inventaire.Dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class RapportStatistiquesDTO {

    private int annee;

    private long totalArticles;
    private long articlesNeufs;
    private long articlesDisponibles;
    private long articlesEnPanne;
    private long articlesMaintenance;
    private long articlesHorsService;

    private double valeurTotale;
    private Map<String, Long> articlesParCategorie;
    private Map<String, Long> articlesParLaboratoire;
    private Map<String, Long> articlesParService;


    private long totalMouvements;
    private long affectations;
    private long transferts;
    private long prets;
    private long retours;
    private long reparations;
    private long maintenances;
    private long sortiesDefinitives;

    private long totalInventaires;
    private long inventairesPresents;
    private long inventairesAbsents;


    private long totalCampagnes;
    private String statutCampagne;
    private double progressionInventaire;
    private long articlesInventories;
    private long totalArticlesCampagne;

    private long totalUtilisateurs;
    private long administrateurs;
    private long responsables;
    private long agentsInventaire;

    private Map<String, Long> utilisateursParLaboratoire;
    private Map<String, Long> utilisateursParService;
}