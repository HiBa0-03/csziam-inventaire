package ma.csziam.inventaire.Services;

import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.InventaireRequestDTO;
import ma.csziam.inventaire.Dto.InventaireResponseDTO;
import ma.csziam.inventaire.Entities.Article;
import ma.csziam.inventaire.Entities.CampagneInventaire;
import ma.csziam.inventaire.Entities.Inventaire;
import ma.csziam.inventaire.Entities.Utilisateur;
import ma.csziam.inventaire.Enums.RoleUtilisateur;
import ma.csziam.inventaire.Enums.StatutInventaire;
import ma.csziam.inventaire.Repositories.ArticleRepository;
import ma.csziam.inventaire.Repositories.CampagneRepository;
import ma.csziam.inventaire.Repositories.InventaireRepository;
import ma.csziam.inventaire.Repositories.UtilisateurRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InventaireServiceImpl implements InventaireService {

    private final InventaireRepository inventaireRepository;
    private final ArticleRepository articleRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final CampagneRepository campagneRepository;

    @Override
    public InventaireResponseDTO creerInventaire(InventaireRequestDTO dto) {


        Article article = articleRepository.findById(dto.getArticleId())
                .orElseThrow(() -> new RuntimeException("Article non trouvé"));

        Utilisateur agent = utilisateurRepository.findById(dto.getAgentId())
                .orElseThrow(() -> new RuntimeException("Agent non trouvé"));

        CampagneInventaire campagne = campagneRepository.findById(dto.getCampagneId())
                .orElseThrow(() -> new RuntimeException("Campagne non trouvée"));
        if (agent.getRoleUtilisateur() != RoleUtilisateur.AGENT_INVENTAIRE) {
            throw new RuntimeException("L'utilisateur sélectionné n'est pas un agent d'inventaire.");
        }
        if (campagne.getStatut() != StatutInventaire.EN_COURS) {
            throw new RuntimeException("La campagne n'est pas en cours.");
        }
        if (inventaireRepository.findByArticleIdAndCampagneId
                (dto.getArticleId(), dto.getCampagneId()).isPresent()) {
            throw new RuntimeException("Cet article a déjà été inventorié pour cette campagne.");
        }




        Inventaire inventaire = new Inventaire();

        inventaire.setDateVerification(LocalDate.now());
        inventaire.setStatutPresence(dto.getStatutPresence());
        inventaire.setCommentaire(dto.getCommentaire());
        inventaire.setArticle(article);
        inventaire.setAgent(agent);
        inventaire.setCampagne(campagne);

        Inventaire inventaireSauvegarde = inventaireRepository.save(inventaire);

        InventaireResponseDTO response = new InventaireResponseDTO();

        response.setId(inventaireSauvegarde.getId());
        response.setDateVerification(inventaireSauvegarde.getDateVerification());
        response.setStatutPresence(inventaireSauvegarde.getStatutPresence());
        response.setCommentaire(inventaireSauvegarde.getCommentaire());
        response.setArticleId(inventaireSauvegarde.getArticle().getId());
        response.setAgentId(inventaireSauvegarde.getAgent().getId());
        response.setCampagneId(inventaireSauvegarde.getCampagne().getId());

        return response;
    }

    @Override
    public List<InventaireResponseDTO> findAllInventaires() {

        List<Inventaire> inventaires = inventaireRepository.findAll();

        return inventaires.stream()
                .map(inventaire -> {

                    InventaireResponseDTO dto = new InventaireResponseDTO();

                    dto.setId(inventaire.getId());
                    dto.setDateVerification(inventaire.getDateVerification());
                    dto.setStatutPresence(inventaire.getStatutPresence());
                    dto.setCommentaire(inventaire.getCommentaire());
                    dto.setArticleId(inventaire.getArticle().getId());
                    dto.setAgentId(inventaire.getAgent().getId());
                    dto.setCampagneId(inventaire.getCampagne().getId());

                    return dto;
                })
                .toList();
    }

    @Override
    public InventaireResponseDTO findInventaireById(Long id) {

        Inventaire inventaire = inventaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventaire non trouvé"));

        InventaireResponseDTO dto = new InventaireResponseDTO();

        dto.setId(inventaire.getId());
        dto.setDateVerification(inventaire.getDateVerification());
        dto.setStatutPresence(inventaire.getStatutPresence());
        dto.setCommentaire(inventaire.getCommentaire());
        dto.setArticleId(inventaire.getArticle().getId());
        dto.setAgentId(inventaire.getAgent().getId());
        dto.setCampagneId(inventaire.getCampagne().getId());

        return dto;
    }

    @Override
    public InventaireResponseDTO modifierInventaire(Long id, InventaireRequestDTO dto) {

        Inventaire inventaire = inventaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventaire non trouvé"));

        Article article = articleRepository.findById(dto.getArticleId())
                .orElseThrow(() -> new RuntimeException("Article non trouvé"));

        Utilisateur agent = utilisateurRepository.findById(dto.getAgentId())
                .orElseThrow(() -> new RuntimeException("Agent non trouvé"));

        CampagneInventaire campagne = campagneRepository.findById(dto.getCampagneId())
                .orElseThrow(() -> new RuntimeException("Campagne non trouvée"));


        if (agent.getRoleUtilisateur() != RoleUtilisateur.AGENT_INVENTAIRE) {
            throw new RuntimeException("L'utilisateur sélectionné n'est pas un agent d'inventaire.");
        }

        if (campagne.getStatut() != StatutInventaire.EN_COURS) {
            throw new RuntimeException("La campagne n'est pas en cours.");
        }

        Optional<Inventaire> inventaireExistant =
                inventaireRepository.findByArticleIdAndCampagneId(
                        dto.getArticleId(),
                        dto.getCampagneId());

        if (inventaireExistant.isPresent() && !inventaireExistant.get().getId().equals(id)) {
            throw new RuntimeException(
                    "Cet article a déjà été inventorié dans cette campagne.");
        }

        inventaire.setStatutPresence(dto.getStatutPresence());
        inventaire.setCommentaire(dto.getCommentaire());

        inventaire.setArticle(article);
        inventaire.setAgent(agent);
        inventaire.setCampagne(campagne);

        Inventaire inventaireSauvegarde = inventaireRepository.save(inventaire);

        InventaireResponseDTO response = new InventaireResponseDTO();

        response.setId(inventaireSauvegarde.getId());
        response.setDateVerification(inventaireSauvegarde.getDateVerification());
        response.setStatutPresence(inventaireSauvegarde.getStatutPresence());
        response.setCommentaire(inventaireSauvegarde.getCommentaire());
        response.setArticleId(inventaireSauvegarde.getArticle().getId());
        response.setAgentId(inventaireSauvegarde.getAgent().getId());
        response.setCampagneId(inventaireSauvegarde.getCampagne().getId());

        return response;
    }

    @Override
    public void supprimerInventaire(Long id) {

        Inventaire inventaire = inventaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventaire non trouvé"));

        inventaireRepository.delete(inventaire);
    }

}