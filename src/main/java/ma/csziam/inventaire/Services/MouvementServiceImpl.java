package ma.csziam.inventaire.Services;

import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.MouvementRequestDTO;
import ma.csziam.inventaire.Dto.MouvementResponseDTO;
import ma.csziam.inventaire.Entities.Article;
import ma.csziam.inventaire.Entities.Laboratoire;
import ma.csziam.inventaire.Entities.Mouvement;
import ma.csziam.inventaire.Entities.ServiceOrganisationnel;
import ma.csziam.inventaire.Entities.Utilisateur;
import ma.csziam.inventaire.Enums.EtatArticle;
import ma.csziam.inventaire.Enums.RoleUtilisateur;
import ma.csziam.inventaire.Enums.TypeMouvement;
import ma.csziam.inventaire.Repositories.ArticleRepository;
import ma.csziam.inventaire.Repositories.LaboratoireRepository;
import ma.csziam.inventaire.Repositories.MouvementRepository;
import ma.csziam.inventaire.Repositories.ServiceOrganisationnelRepository;
import ma.csziam.inventaire.Repositories.UtilisateurRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MouvementServiceImpl implements MouvementService {

    private final MouvementRepository mouvementRepository;
    private final ArticleRepository articleRepository;
    private final LaboratoireRepository laboratoireRepository;
    private final ServiceOrganisationnelRepository serviceRepository;
    private final UtilisateurRepository utilisateurRepository;

    @Override
    @Transactional
    public MouvementResponseDTO creeMouvement(MouvementRequestDTO requestDTO) {
        if (requestDTO.getArticleId() == null) {
            throw new RuntimeException("Veuillez sélectionner un article.");
        }

        Article article = articleRepository.findById(requestDTO.getArticleId())
                .orElseThrow(() -> new RuntimeException("Article non trouvé."));

        TypeMouvement type = requestDTO.getTypeMouvement();

        if (type == null) {
            throw new RuntimeException("Veuillez sélectionner un type de mouvement.");
        }

        EtatArticle etat = article.getEtat();

        if (etat == EtatArticle.HORS_SERVICE && type != TypeMouvement.SORTIE_DEFINITIVE) {
            throw new RuntimeException("Cet article est hors service. Seule une sortie définitive est autorisée.");
        }
        if ((etat == EtatArticle.EN_PANNE
                || etat == EtatArticle.MAINTENANCE)
                && (type == TypeMouvement.PRET
                || type == TypeMouvement.AFFECTATION
                || type == TypeMouvement.TRANSFERT)) {
            throw new RuntimeException("Cet article ne peut pas être prêté, affecté ou transféré dans son état actuel.");
        }

        String ancienneLocalisation = getLocalisationArticle(article);

        Utilisateur utilisateur = null;

        if (requestDTO.getUtilisateurId() != null) {

            utilisateur = utilisateurRepository.findById(requestDTO.getUtilisateurId())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé.")
            );
        }

        if (type == TypeMouvement.AFFECTATION) {
            if (utilisateur == null) {
                throw new RuntimeException("Veuillez sélectionner un responsable.");
            }
            if (utilisateur.getRoleUtilisateur() != RoleUtilisateur.RESPONSABLE) {
                throw new RuntimeException("Un article ne peut être affecté qu'à un responsable.");
            }
            verifierResponsableCorrespondALocalisation(utilisateur, article);

            Mouvement mouvement = new Mouvement();

            mouvement.setDate(requestDTO.getDate() != null ? requestDTO.getDate(): LocalDate.now());

            mouvement.setTypeMouvement(type);
            mouvement.setMotif(requestDTO.getMotif());
            mouvement.setArticle(article);
            mouvement.setUtilisateur(utilisateur);
            mouvement.setAncienneLocalisation(ancienneLocalisation);
            mouvement.setNouvelleLocalisation(ancienneLocalisation);

            Mouvement sauvegarde = mouvementRepository.save(mouvement);

            return convertirEnDTO(sauvegarde);
        }

        if (type == TypeMouvement.PRET) {
            if (utilisateur == null) {
                throw new RuntimeException("Veuillez sélectionner l'utilisateur bénéficiaire du prêt.");
            }

            if (requestDTO.getLaboratoireId() != null && requestDTO.getServiceId() != null) {
                throw new RuntimeException("Un article ne peut appartenir qu'à un laboratoire OU à un service.");
            }

            if (requestDTO.getLaboratoireId() == null && requestDTO.getServiceId() == null) {
                throw new RuntimeException("Veuillez sélectionner un service ou un laboratoire.");
            }

            Laboratoire laboratoire = null;
            ServiceOrganisationnel service = null;

            if (requestDTO.getLaboratoireId() != null) {

                laboratoire = laboratoireRepository.findById(requestDTO.getLaboratoireId())
                        .orElseThrow(() -> new RuntimeException("Laboratoire non trouvé."));
            }

            if (requestDTO.getServiceId() != null) {

                service = serviceRepository.findById(requestDTO.getServiceId())
                        .orElseThrow(() -> new RuntimeException("Service non trouvé."));
            }

            String nouvelleLocalisation;

            if (laboratoire != null) {
                article.setLaboratoire(laboratoire);
                article.setService(null);
                nouvelleLocalisation = laboratoire.getNom();
            } else {
                article.setService(service);
                article.setLaboratoire(null);
                nouvelleLocalisation = service.getNom();
            }

            articleRepository.save(article);

            Mouvement mouvement = new Mouvement();

            mouvement.setDate(
                    requestDTO.getDate() != null
                            ? requestDTO.getDate()
                            : LocalDate.now()
            );

            mouvement.setTypeMouvement(type);
            mouvement.setMotif(requestDTO.getMotif());
            mouvement.setArticle(article);
            mouvement.setUtilisateur(utilisateur);
            mouvement.setAncienneLocalisation(ancienneLocalisation);
            mouvement.setNouvelleLocalisation(nouvelleLocalisation);

            Mouvement sauvegarde = mouvementRepository.save(mouvement);

            return convertirEnDTO(sauvegarde);
        }

        if (type == TypeMouvement.TRANSFERT) {

            if (requestDTO.getLaboratoireId() != null && requestDTO.getServiceId() != null) {
                throw new RuntimeException("Un article ne peut appartenir qu'à un laboratoire OU à un service.");
            }

            if (requestDTO.getLaboratoireId() == null && requestDTO.getServiceId() == null) {
                throw new RuntimeException("Veuillez sélectionner un service ou un laboratoire.");
            }

            Laboratoire laboratoire = null;
            ServiceOrganisationnel service = null;

            if (requestDTO.getLaboratoireId() != null) {
                laboratoire = laboratoireRepository.findById(requestDTO.getLaboratoireId())
                        .orElseThrow(() -> new RuntimeException("Laboratoire non trouvé."));
            }

            if (requestDTO.getServiceId() != null) {
                service = serviceRepository.findById(requestDTO.getServiceId())
                        .orElseThrow(() -> new RuntimeException("Service non trouvé."));
            }

            String nouvelleLocalisation;

            if (laboratoire != null) {
                article.setLaboratoire(laboratoire);
                article.setService(null);
                nouvelleLocalisation = laboratoire.getNom();

            } else {
                article.setService(service);
                article.setLaboratoire(null);
                nouvelleLocalisation = service.getNom();
            }

            articleRepository.save(article);

            Mouvement mouvement = new Mouvement();

            mouvement.setDate(requestDTO.getDate() != null ? requestDTO.getDate(): LocalDate.now());
            mouvement.setTypeMouvement(type);
            mouvement.setMotif(requestDTO.getMotif());
            mouvement.setArticle(article);
            mouvement.setUtilisateur(null);
            mouvement.setAncienneLocalisation(ancienneLocalisation);
            mouvement.setNouvelleLocalisation(nouvelleLocalisation);

            Mouvement sauvegarde = mouvementRepository.save(mouvement);

            return convertirEnDTO(sauvegarde);
        }

        if (type == TypeMouvement.REPARATION) {

            article.setEtat(EtatArticle.EN_PANNE);

            articleRepository.save(article);

            Mouvement mouvement = new Mouvement();

            mouvement.setDate(requestDTO.getDate() != null ? requestDTO.getDate(): LocalDate.now());
            mouvement.setTypeMouvement(type);
            mouvement.setMotif(requestDTO.getMotif());
            mouvement.setArticle(article);
            mouvement.setUtilisateur(utilisateur);
            mouvement.setAncienneLocalisation(ancienneLocalisation);
            mouvement.setNouvelleLocalisation("Réparation");

            Mouvement sauvegarde = mouvementRepository.save(mouvement);

            return convertirEnDTO(sauvegarde);
        }

        if (type == TypeMouvement.MAINTENANCE) {

            article.setEtat(EtatArticle.MAINTENANCE);

            articleRepository.save(article);

            Mouvement mouvement = new Mouvement();

            mouvement.setDate(requestDTO.getDate() != null ? requestDTO.getDate(): LocalDate.now());
            mouvement.setTypeMouvement(type);
            mouvement.setMotif(requestDTO.getMotif());
            mouvement.setArticle(article);
            mouvement.setUtilisateur(utilisateur);
            mouvement.setAncienneLocalisation(ancienneLocalisation);
            mouvement.setNouvelleLocalisation("Maintenance");

            Mouvement sauvegarde = mouvementRepository.save(mouvement);

            return convertirEnDTO(sauvegarde);
        }

        if (type == TypeMouvement.RETOUR) {

            Mouvement dernierMouvement = mouvementRepository.findTopByArticleIdOrderByDateDesc(article.getId())
                    .orElse(null);

            if (dernierMouvement == null) {
                throw new RuntimeException("Aucun mouvement précédent trouvé.");
            }

            String nouvelleLocalisation = dernierMouvement.getAncienneLocalisation();

            Laboratoire laboratoire = laboratoireRepository.findByNom(nouvelleLocalisation)
                            .orElse(null);

            ServiceOrganisationnel service = serviceRepository.findByNom(nouvelleLocalisation)
                            .orElse(null);

            if (laboratoire != null) {
                article.setLaboratoire(laboratoire);
                article.setService(null);

            } else if (service != null) {
                article.setService(service);
                article.setLaboratoire(null);

            }

            article.setEtat(EtatArticle.DISPONIBLE);

            articleRepository.save(article);

            Mouvement mouvement = new Mouvement();

            mouvement.setDate(requestDTO.getDate() != null ? requestDTO.getDate() : LocalDate.now());
            mouvement.setTypeMouvement(type);
            mouvement.setMotif(requestDTO.getMotif());
            mouvement.setArticle(article);
            mouvement.setUtilisateur(utilisateur);
            mouvement.setAncienneLocalisation(ancienneLocalisation);
            mouvement.setNouvelleLocalisation(nouvelleLocalisation);

            Mouvement sauvegarde = mouvementRepository.save(mouvement);

            return convertirEnDTO(sauvegarde);
        }
        if (type == TypeMouvement.SORTIE_DEFINITIVE) {

            Mouvement mouvement = new Mouvement();

            mouvement.setDate(requestDTO.getDate() != null ? requestDTO.getDate() : LocalDate.now());
            mouvement.setTypeMouvement(type);
            mouvement.setMotif(requestDTO.getMotif());
            mouvement.setArticle(article);
            mouvement.setUtilisateur(utilisateur);
            mouvement.setAncienneLocalisation(ancienneLocalisation);
            mouvement.setNouvelleLocalisation("Sortie définitive");

            Mouvement sauvegarde = mouvementRepository.save(mouvement);
            /*
             * Pour l'instant on conserve l'article.
             *
             * On décidera plus tard si une sortie définitive
             * doit réellement supprimer l'article ou simplement
             * le marquer comme sorti.
             */
            article.setEtat(EtatArticle.HORS_SERVICE);
            articleRepository.save(article);

            return convertirEnDTO(sauvegarde);
        }


        throw new RuntimeException(
                "Type de mouvement non pris en charge."
        );
    }

    private void verifierResponsableCorrespondALocalisation(Utilisateur responsable, Article article) {
        if (article.getLaboratoire() != null) {

            if (responsable.getLaboratoire() == null) {
                throw new RuntimeException("Ce responsable n'est affecté à aucun laboratoire.");
            }

            if (!responsable.getLaboratoire().getId().equals(article.getLaboratoire().getId())) {
                throw new RuntimeException("Ce responsable n'appartient pas au laboratoire de l'article.");
            }
            return;
        }


        if (article.getService() != null) {

            if (responsable.getService() == null) {
                throw new RuntimeException("Ce responsable n'est affecté à aucun service.");
            }

            if (!responsable.getService().getId().equals(article.getService().getId())) {
                throw new RuntimeException("Ce responsable n'appartient pas au service de l'article.");
            }
            return;
        }

        throw new RuntimeException("L'article n'a aucune localisation définie.");
    }

    private String getLocalisationArticle(Article article) {

        if (article.getLaboratoire() != null) {
            return article.getLaboratoire().getNom();
        }

        if (article.getService() != null) {
            return article.getService().getNom();
        }

        return "Non renseigné";
    }

    private MouvementResponseDTO convertirEnDTO(Mouvement mouvement) {

        MouvementResponseDTO dto = new MouvementResponseDTO();

        dto.setId(mouvement.getId());
        dto.setDate(mouvement.getDate());
        dto.setTypeMouvement(mouvement.getTypeMouvement());
        dto.setMotif(mouvement.getMotif());
        dto.setAncienneLocalisation(mouvement.getAncienneLocalisation());
        dto.setNouvelleLocalisation(mouvement.getNouvelleLocalisation());

        if (mouvement.getArticle() != null) {
            dto.setArticleId(mouvement.getArticle().getId());
            dto.setArticleDesignation(mouvement.getArticle().getDesignation());
        }

        if (mouvement.getUtilisateur() != null) {
            dto.setUtilisateurId(mouvement.getUtilisateur().getId());
            dto.setUtilisateurNom(mouvement.getUtilisateur().getNom());
        }


        if (mouvement.getArticle() != null && mouvement.getArticle().getLaboratoire() != null) {
            dto.setLaboratoireId(mouvement.getArticle().getLaboratoire().getId());
            dto.setLaboratoireNom(mouvement.getArticle().getLaboratoire().getNom());
        }
        if (mouvement.getArticle() != null && mouvement.getArticle().getService() != null) {
            dto.setServiceId(mouvement.getArticle().getService().getId());
            dto.setServiceNom(mouvement.getArticle().getService().getNom());
        }
        return dto;
    }
    @Override
    public List<MouvementResponseDTO> findAllMouvements() {
        return mouvementRepository.findAll()
                .stream()
                .map(this::convertirEnDTO)
                .toList();
    }
}
