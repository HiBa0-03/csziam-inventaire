package ma.csziam.inventaire.Services;

import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.*;
import ma.csziam.inventaire.Enums.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RapportServiceImpl implements RapportService {

    private final ArticleService articleService;
    private final MouvementService mouvementService;
    private final InventaireService inventaireService;
    private final CampagneService campagneService;
    private final UtilisateurService utilisateurService;
    private final IAReportService iaReportService;
    private String dernierRapport;

    @Override
    public RapportStatistiquesDTO calculerStatistiques() {

        RapportStatistiquesDTO statistiques = new RapportStatistiquesDTO();

        List<ArticleResponseDTO> articles =
                articleService.findAllArticles();

        List<MouvementResponseDTO> mouvements =
                mouvementService.findAllMouvements();

        List<InventaireResponseDTO> inventaires =
                inventaireService.findAllInventaires();

        List<CampagneResponseDTO> campagnes =
                campagneService.findAllCampagnes();

        List<UtilisateurResponseDTO> utilisateurs =
                utilisateurService.getAllUtilisateurs();

        statistiques.setAnnee(LocalDate.now().getYear());

        //STATISTIQUES DES ARTICLES

        statistiques.setTotalArticles(articles.size());

        long articlesNeufs = articles.stream()
                .filter(article -> article.getEtat() == EtatArticle.NEUF)
                .count();

        long articlesDisponibles = articles.stream()
                .filter(article -> article.getEtat() == EtatArticle.DISPONIBLE)
                .count();

        long articlesEnPanne = articles.stream()
                .filter(article -> article.getEtat() == EtatArticle.EN_PANNE)
                .count();

        long articlesMaintenance = articles.stream()
                .filter(article -> article.getEtat() == EtatArticle.MAINTENANCE)
                .count();

        long articlesHorsService = articles.stream()
                .filter(article -> article.getEtat() == EtatArticle.HORS_SERVICE)
                .count();

        statistiques.setArticlesNeufs(articlesNeufs);
        statistiques.setArticlesDisponibles(articlesDisponibles);
        statistiques.setArticlesEnPanne(articlesEnPanne);
        statistiques.setArticlesMaintenance(articlesMaintenance);
        statistiques.setArticlesHorsService(articlesHorsService);

        //VALEUR TOTALE DU PATRIMOINE
        double valeurTotale = articles.stream()
                .filter(article -> article.getValeur() != null)
                .mapToDouble(ArticleResponseDTO::getValeur)
                .sum();

        statistiques.setValeurTotale(valeurTotale);
        //ARTICLES PAR CATÉGORIE
        Map<String, Long> articlesParCategorie = new HashMap<>();

        for (ArticleResponseDTO article : articles) {

            String categorie = article.getCategorieNom();

            if (categorie == null || categorie.isBlank()) {
                categorie = "Non renseignée";
            }

            articlesParCategorie.merge(categorie, 1L, Long::sum);
        }

        statistiques.setArticlesParCategorie(articlesParCategorie);

        //ARTICLES PAR LABORATOIRE

        Map<String, Long> articlesParLaboratoire = new HashMap<>();

        for (ArticleResponseDTO article : articles) {

            if (article.getLaboratoireId() != null) {

                String laboratoire = article.getAffectation();

                if (laboratoire == null || laboratoire.isBlank()) {
                    laboratoire = "Laboratoire non renseigné";
                }

                articlesParLaboratoire.merge(
                        laboratoire,
                        1L,
                        Long::sum
                );
            }
        }

        statistiques.setArticlesParLaboratoire(articlesParLaboratoire);

        //ARTICLES PAR SERVICE
        Map<String, Long> articlesParService = new HashMap<>();

        for (ArticleResponseDTO article : articles) {

            if (article.getServiceId() != null) {

                String service = article.getAffectation();

                if (service == null || service.isBlank()) {
                    service = "Service non renseigné";
                }

                articlesParService.merge(
                        service,
                        1L,
                        Long::sum
                );
            }
        }

        statistiques.setArticlesParService(articlesParService);

        //STATISTIQUES DES MOUVEMENTS
        statistiques.setTotalMouvements(mouvements.size());

        long affectations = mouvements.stream()
                .filter(m -> m.getTypeMouvement() == TypeMouvement.AFFECTATION)
                .count();

        long transferts = mouvements.stream()
                .filter(m -> m.getTypeMouvement() == TypeMouvement.TRANSFERT)
                .count();

        long prets = mouvements.stream()
                .filter(m -> m.getTypeMouvement() == TypeMouvement.PRET)
                .count();

        long retours = mouvements.stream()
                .filter(m -> m.getTypeMouvement() == TypeMouvement.RETOUR)
                .count();

        long reparations = mouvements.stream()
                .filter(m -> m.getTypeMouvement() == TypeMouvement.REPARATION)
                .count();

        long maintenances = mouvements.stream()
                .filter(m -> m.getTypeMouvement() == TypeMouvement.MAINTENANCE)
                .count();

        long sortiesDefinitives = mouvements.stream()
                .filter(m -> m.getTypeMouvement() == TypeMouvement.SORTIE_DEFINITIVE)
                .count();

        statistiques.setAffectations(affectations);
        statistiques.setTransferts(transferts);
        statistiques.setPrets(prets);
        statistiques.setRetours(retours);
        statistiques.setReparations(reparations);
        statistiques.setMaintenances(maintenances);
        statistiques.setSortiesDefinitives(sortiesDefinitives);

        //STATISTIQUES DES INVENTAIRES
        statistiques.setTotalInventaires(inventaires.size());

        long inventairesPresents = inventaires.stream()
                .filter(i -> i.getStatutPresence() == StatutPresence.PRESENT)
                .count();

        long inventairesAbsents = inventaires.stream()
                .filter(i -> i.getStatutPresence() == StatutPresence.ABSENT)
                .count();

        statistiques.setInventairesPresents(inventairesPresents);
        statistiques.setInventairesAbsents(inventairesAbsents);

        // STATISTIQUES DES UTILISATEURS
        statistiques.setTotalUtilisateurs(utilisateurs.size());

        long administrateurs = utilisateurs.stream()
                .filter(u -> u.getRoleUtilisateur() == RoleUtilisateur.ADMIN)
                .count();

        long responsables = utilisateurs.stream()
                .filter(u -> u.getRoleUtilisateur() == RoleUtilisateur.RESPONSABLE)
                .count();

        long agentsInventaire = utilisateurs.stream()
                .filter(u -> u.getRoleUtilisateur() == RoleUtilisateur.AGENT_INVENTAIRE)
                .count();

        statistiques.setAdministrateurs(administrateurs);
        statistiques.setResponsables(responsables);
        statistiques.setAgentsInventaire(agentsInventaire);
        //UTILISATEURS PAR LABORATOIRE
        Map<String, Long> utilisateursParLaboratoire = new HashMap<>();

        for (UtilisateurResponseDTO utilisateur : utilisateurs) {

            if (utilisateur.getLaboratoireId() != null) {

                String laboratoire = utilisateur.getLaboratoireNom();

                if (laboratoire == null || laboratoire.isBlank()) {
                    laboratoire = "Laboratoire non renseigné";
                }

                utilisateursParLaboratoire.merge(
                        laboratoire,
                        1L,
                        Long::sum
                );
            }
        }

        statistiques.setUtilisateursParLaboratoire(
                utilisateursParLaboratoire
        );

        //UTILISATEURS PAR SERVICE
        Map<String, Long> utilisateursParService = new HashMap<>();

        for (UtilisateurResponseDTO utilisateur : utilisateurs) {

            if (utilisateur.getServiceId() != null) {

                String service = utilisateur.getServiceNom();

                if (service == null || service.isBlank()) {
                    service = "Service non renseigné";
                }

                utilisateursParService.merge(
                        service,
                        1L,
                        Long::sum
                );
            }
        }

        statistiques.setUtilisateursParService(
                utilisateursParService
        );

        //STATISTIQUES DES CAMPAGNES

        statistiques.setTotalCampagnes(campagnes.size());

        if (!campagnes.isEmpty()) {

            /*On cherche en priorité la campagne EN_COURS. Sinon, on prend la campagne la plus récente. */

            CampagneResponseDTO campagneSelectionnee =
                    campagnes.stream()
                            .filter(c -> c.getStatut() == StatutInventaire.EN_COURS)
                            .findFirst()
                            .orElse(
                                    campagnes.stream()
                                            .max(
                                                    (c1, c2) ->
                                                            Integer.compare(
                                                                    c1.getAnnee(),
                                                                    c2.getAnnee()
                                                            )
                                            )
                                            .orElse(null)
                            );

            if (campagneSelectionnee != null) {

                statistiques.setStatutCampagne(
                        campagneSelectionnee.getStatut().name()
                );

                statistiques.setProgressionInventaire(
                        campagneSelectionnee.getProgression()
                );

                statistiques.setArticlesInventories(
                        campagneSelectionnee.getArticlesInventories()
                );

                statistiques.setTotalArticlesCampagne(
                        campagneSelectionnee.getTotalArticles()
                );
            }
        }

        return statistiques;
    }

    @Override
    public String genererRapport() {

        RapportStatistiquesDTO statistiques = calculerStatistiques();

        dernierRapport = iaReportService.genererRapport(statistiques);

        return dernierRapport;
    }
    @Override
    public String getDernierRapport() {

        if (dernierRapport == null || dernierRapport.isBlank()) {
            throw new RuntimeException(
                    "Aucun rapport n'a encore été généré."
            );
        }

        return dernierRapport;
    }
}