package ma.csziam.inventaire.Services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.RapportStatistiquesDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class IAReportServiceImpl implements IAReportService {

    @Value("${ollama.url}")
    private String ollamaUrl;

    @Value("${ollama.model}")
    private String ollamaModel;

    private final ObjectMapper objectMapper;

    @Override
    public String genererRapport(RapportStatistiquesDTO statistiques) {

        String prompt = construirePrompt(statistiques);

        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> request = new HashMap<>();
        request.put("model", ollamaModel);
        request.put("prompt", prompt);
        request.put("stream", false);

        try {

            String response = restTemplate.postForObject(
                    ollamaUrl + "/api/generate",
                    request,
                    String.class
            );

            JsonNode jsonResponse = objectMapper.readTree(response);

            return jsonResponse.get("response").asText();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Erreur lors de la génération du rapport avec Ollama : "
                    + e.getMessage()
            );
        }
    }

    private String construirePrompt(RapportStatistiquesDTO s) {

        StringBuilder prompt = new StringBuilder();

        prompt.append("""
            Tu es un assistant spécialisé dans la rédaction de rapports administratifs professionnels pour la gestion du patrimoine et des inventaires.

            À partir UNIQUEMENT des données fournies ci-dessous, rédige un rapport d'inventaire professionnel en français.

            RÈGLES ABSOLUES :

            - Utilise uniquement les données fournies.
            - N'invente aucune donnée, aucun événement, aucune cause et aucune information.
            - Ne déduis aucune cause à partir des statistiques.
            - Ne présente jamais une situation comme bonne, mauvaise, importante, élevée, faible, insuffisante, satisfaisante ou préoccupante sans comparaison objective fournie dans les données.
            - Ne considère jamais "en panne", "en maintenance" ou "hors service" comme des catégories. Ce sont des états des articles.
            - Présente tous les types de mouvements fournis dans les données.
            - Ne considère pas automatiquement un nombre élevé de mouvements comme un problème.
            - Ne prétends jamais qu'une action a déjà été réalisée si cela n'est pas indiqué dans les données.
            - Les recommandations doivent être formulées comme des actions futures ou des mesures de suivi.
            - Chaque recommandation doit être directement liée à une donnée ou à un constat du rapport.
            - Les pourcentages doivent être calculés uniquement à partir des nombres fournis.
            - Si une donnée est absente, ne l'invente pas.
            - Utilise un style professionnel, administratif, clair, neutre et objectif.
            - Présente les statistiques principalement sous forme de paragraphes.
            - Utilise des listes numérotées uniquement dans les sections "PRINCIPAUX CONSTATS" et "RECOMMANDATIONS".
            - Les titres des sections doivent être clairement séparés du contenu.
            - Utilise la notation française pour les nombres et les pourcentages : espace pour les milliers et virgule pour les décimales.
            - Écris "268 400 DH" et non "268400.0 DH".
            - Écris "0 %" et non "0.0 %".

            STRUCTURE OBLIGATOIRE :

            INTRODUCTION

            Présente brièvement l'objectif du rapport et indique qu'il présente les données relatives au patrimoine du Centre CSZIAM pour l'année concernée.

            SYNTHÈSE GÉNÉRALE

            Présente une synthèse des principaux indicateurs :
            - nombre total d'articles ;
            - valeur totale du patrimoine ;
            - état des articles ;
            - nombre total de mouvements ;
            - inventaires ;
            - utilisateurs.

            ÉTAT DU PATRIMOINE

            Présente le nombre et le pourcentage d'articles disponibles, en panne, en maintenance et hors service.

            RÉPARTITION DU PATRIMOINE

            Présente la répartition des articles par catégorie, par laboratoire et par service.

            Ne suppose pas que les répartitions par laboratoire ou par service représentent nécessairement la totalité des articles si les données ne permettent pas de l'affirmer.

            ANALYSE DES MOUVEMENTS

            Présente le nombre total de mouvements ainsi que le nombre et le pourcentage de chaque type de mouvement fourni.

            Tous les types de mouvements présents dans les données doivent être mentionnés.

            ÉTAT DE L'INVENTAIRE

            Présente le nombre total d'inventaires, les inventaires présents, les inventaires absents et le taux de présence.

            CAMPAGNE D'INVENTAIRE

            Présente la campagne sélectionnée, son statut, sa progression et le nombre d'articles inventoriés par rapport au nombre total d'articles de la campagne.

            Si la campagne est "EN_COURS", indique simplement qu'elle est actuellement en cours.

            Si la progression est de 0 % avec 0 article inventorié, indique simplement qu'aucun article n'a encore été inventorié dans la campagne sélectionnée.

            Ne donne aucune explication sur cette situation si elle n'est pas fournie dans les données.

            ANALYSE DES UTILISATEURS

            Présente le nombre total d'utilisateurs et la répartition entre administrateurs, responsables et agents d'inventaire.

            Présente également les répartitions par laboratoire et par service lorsqu'elles sont fournies.

            Ne suppose pas que les répartitions par laboratoire ou par service représentent nécessairement la totalité des utilisateurs si les données ne permettent pas de l'affirmer.

            PRINCIPAUX CONSTATS

            Présente EXACTEMENT 3 constats.

            Les trois constats doivent être strictement objectifs, factuels et vérifiables à partir des données.

            Chaque constat doit utiliser des chiffres précis lorsque cela est pertinent.

            Ne jamais utiliser de jugement subjectif comme :
            "patrimoine important",
            "nombre élevé",
            "nombre faible",
            "situation préoccupante",
            "situation satisfaisante",
            "attention particulière",
            sauf si une comparaison objective dans les données permet réellement de le démontrer.

            Exemple acceptable :
            "Le Centre CSZIAM compte 30 articles, dont 24 disponibles, 3 en panne, 2 en maintenance et 1 hors service."

            Exemple interdit :
            "Le Centre CSZIAM dispose d'un patrimoine important."

            RECOMMANDATIONS

            Présente entre 3 et 5 recommandations.

            Les recommandations doivent être concrètes, professionnelles et directement liées aux données ou aux constats.

            Elles doivent être formulées comme des actions futures possibles.

            Exemple :
            "Assurer un suivi des articles en panne et en maintenance."

            Exemple :
            "Effectuer un suivi des inventaires absents afin de compléter les opérations d'inventaire."

            Exemple :
            "Poursuivre la campagne d'inventaire en cours et enregistrer progressivement les articles inventoriés."

            Ne propose aucune action sans lien direct avec les données fournies.

            CONCLUSION

            Résume les principaux indicateurs du rapport sans introduire de nouvelles informations, de nouvelles interprétations ou de nouvelles causes.

            DONNÉES À ANALYSER :

            """);

        prompt.append("Année : ")
                .append(s.getAnnee())
                .append("\n\n");

        prompt.append("Nombre total d'articles : ")
                .append(s.getTotalArticles())
                .append("\n");

        prompt.append("Articles neufs : ")
                .append(s.getArticlesNeufs())
                .append("\n");

        prompt.append("Articles disponibles : ")
                .append(s.getArticlesDisponibles())
                .append("\n");

        prompt.append("Articles en panne : ")
                .append(s.getArticlesEnPanne())
                .append("\n");

        prompt.append("Articles en maintenance : ")
                .append(s.getArticlesMaintenance())
                .append("\n");

        prompt.append("Articles hors service : ")
                .append(s.getArticlesHorsService())
                .append("\n\n");

        prompt.append("Valeur totale du patrimoine : ")
                .append(s.getValeurTotale())
                .append(" DH\n\n");

        prompt.append("Répartition des articles par catégorie : ")
                .append(s.getArticlesParCategorie())
                .append("\n\n");

        prompt.append("Répartition des articles par laboratoire : ")
                .append(s.getArticlesParLaboratoire())
                .append("\n\n");

        prompt.append("Répartition des articles par service : ")
                .append(s.getArticlesParService())
                .append("\n\n");

        prompt.append("Nombre total de mouvements : ")
                .append(s.getTotalMouvements())
                .append("\n");

        prompt.append("Affectations : ")
                .append(s.getAffectations())
                .append("\n");

        prompt.append("Transferts : ")
                .append(s.getTransferts())
                .append("\n");

        prompt.append("Prêts : ")
                .append(s.getPrets())
                .append("\n");

        prompt.append("Retours : ")
                .append(s.getRetours())
                .append("\n");

        prompt.append("Réparations : ")
                .append(s.getReparations())
                .append("\n");

        prompt.append("Maintenances : ")
                .append(s.getMaintenances())
                .append("\n");

        prompt.append("Sorties définitives : ")
                .append(s.getSortiesDefinitives())
                .append("\n\n");

        prompt.append("Nombre total d'inventaires : ")
                .append(s.getTotalInventaires())
                .append("\n");

        prompt.append("Inventaires présents : ")
                .append(s.getInventairesPresents())
                .append("\n");

        prompt.append("Inventaires absents : ")
                .append(s.getInventairesAbsents())
                .append("\n\n");

        prompt.append("Nombre total de campagnes : ")
                .append(s.getTotalCampagnes())
                .append("\n");

        prompt.append("Statut de la campagne : ")
                .append(s.getStatutCampagne())
                .append("\n");

        prompt.append("Progression de l'inventaire : ")
                .append(s.getProgressionInventaire())
                .append(" %\n");

        prompt.append("Articles inventoriés : ")
                .append(s.getArticlesInventories())
                .append("\n");

        prompt.append("Total des articles de la campagne : ")
                .append(s.getTotalArticlesCampagne())
                .append("\n\n");

        prompt.append("Nombre total d'utilisateurs : ")
                .append(s.getTotalUtilisateurs())
                .append("\n");

        prompt.append("Administrateurs : ")
                .append(s.getAdministrateurs())
                .append("\n");

        prompt.append("Responsables : ")
                .append(s.getResponsables())
                .append("\n");

        prompt.append("Agents d'inventaire : ")
                .append(s.getAgentsInventaire())
                .append("\n\n");

        prompt.append("Répartition des utilisateurs par laboratoire : ")
                .append(s.getUtilisateursParLaboratoire())
                .append("\n\n");

        prompt.append("Répartition des utilisateurs par service : ")
                .append(s.getUtilisateursParService())
                .append("\n\n");

        prompt.append("""
            Rédige maintenant le rapport complet en respectant strictement toutes les règles précédentes.
            """);

        return prompt.toString();
    }


}