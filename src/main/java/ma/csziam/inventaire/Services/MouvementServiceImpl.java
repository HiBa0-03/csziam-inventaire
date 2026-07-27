package ma.csziam.inventaire.Services;

import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.MouvementRequestDTO;
import ma.csziam.inventaire.Dto.MouvementResponseDTO;
import ma.csziam.inventaire.Entities.Article;
import ma.csziam.inventaire.Entities.Laboratoire;
import ma.csziam.inventaire.Entities.Mouvement;
import ma.csziam.inventaire.Entities.ServiceOrganisationnel;
import ma.csziam.inventaire.Repositories.ArticleRepository;
import ma.csziam.inventaire.Repositories.LaboratoireRepository;
import ma.csziam.inventaire.Repositories.MouvementRepository;
import ma.csziam.inventaire.Repositories.ServiceOrganisationnelRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class MouvementServiceImpl implements MouvementService {
    final private MouvementRepository mouvementRepository;
    private final ArticleRepository articleRepository;
    final private LaboratoireRepository laboratoireRepository;
    final private ServiceOrganisationnelRepository serviceRepository;

    @Override
    public MouvementResponseDTO creeMouvement(MouvementRequestDTO requestDTO) {

        Article article = articleRepository.findById(requestDTO.getArticleId())
                .orElseThrow(() -> new RuntimeException("Article non trouvé"));

        if (requestDTO.getLaboratoireId() != null && requestDTO.getServiceId() != null) {
            throw new RuntimeException("Un article ne peut appartenir qu'à un laboratoire OU à un service.");
        }

        if (requestDTO.getLaboratoireId() == null && requestDTO.getServiceId() == null) {
            throw new RuntimeException("Veuillez choisir un laboratoire ou un service.");
        }

        Laboratoire laboratoire = null;
        ServiceOrganisationnel service = null;

        if (requestDTO.getLaboratoireId() != null) {
            laboratoire = laboratoireRepository.findById(requestDTO.getLaboratoireId())
                    .orElseThrow(() -> new RuntimeException("Laboratoire non trouvé"));
        }

        if (requestDTO.getServiceId() != null) {
            service = serviceRepository.findById(requestDTO.getServiceId())
                    .orElseThrow(() -> new RuntimeException("Service non trouvé"));
        }

        Mouvement mouvement = new Mouvement();

        mouvement.setDate(LocalDate.now());
        mouvement.setTypeMouvement(requestDTO.getTypeMouvement());
        mouvement.setMotif(requestDTO.getMotif());

        mouvement.setArticle(article);

        // Ancienne localisation
        if (article.getLaboratoire() != null) {
            mouvement.setAncienneLocalisation(article.getLaboratoire().getNom());
        } else if (article.getService() != null) {
            mouvement.setAncienneLocalisation(article.getService().getNom());
        }

        // Nouvelle localisation + mise à jour de l'article
        if (laboratoire != null) {

            article.setLaboratoire(laboratoire);
            article.setService(null);

            mouvement.setNouvelleLocalisation(laboratoire.getNom());

        } else {

            article.setService(service);
            article.setLaboratoire(null);

            mouvement.setNouvelleLocalisation(service.getNom());
        }

        articleRepository.save(article);

        Mouvement mouvementSauvegarde = mouvementRepository.save(mouvement);

        MouvementResponseDTO response = new MouvementResponseDTO();

        response.setId(mouvementSauvegarde.getId());
        response.setDate(mouvementSauvegarde.getDate());
        response.setTypeMouvement(mouvementSauvegarde.getTypeMouvement());
        response.setMotif(mouvementSauvegarde.getMotif());
        response.setAncienneLocalisation(mouvementSauvegarde.getAncienneLocalisation());
        response.setNouvelleLocalisation(mouvementSauvegarde.getNouvelleLocalisation());

        response.setArticleId(article.getId());

        if (article.getLaboratoire() != null) {
            response.setLaboratoireId(article.getLaboratoire().getId());
        }

        if (article.getService() != null) {
            response.setServiceId(article.getService().getId());
        }

        return response;
    }
}
