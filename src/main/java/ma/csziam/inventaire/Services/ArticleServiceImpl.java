package ma.csziam.inventaire.Services;

import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.ArticleRequestDTO;
import ma.csziam.inventaire.Dto.ArticleResponseDTO;
import ma.csziam.inventaire.Entities.*;
import ma.csziam.inventaire.Repositories.ArticleRepository;
import ma.csziam.inventaire.Repositories.CategorieRepository;
import ma.csziam.inventaire.Repositories.LaboratoireRepository;
import ma.csziam.inventaire.Repositories.ServiceOrganisationnelRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepository articleRepository;

    private final CategorieRepository categorieRepository;

    private final LaboratoireRepository laboratoireRepository;

    private final ServiceOrganisationnelRepository serviceRepository;

    @Override
    public ArticleResponseDTO creeArticle(ArticleRequestDTO dto){


        Categorie categorie = categorieRepository.findById(dto.getCategorieId())
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));

        if (dto.getLaboratoireId() != null && dto.getServiceId() != null) {
            throw new RuntimeException("Un article ne peut appartenir qu'un laboratoire OU à un service.");
        }
        if (dto.getLaboratoireId() == null && dto.getServiceId() == null) {
            throw new RuntimeException("Veuillez choisir un laboratoire ou un service.");
        }

        Laboratoire laboratoire = null;
        ServiceOrganisationnel service = null;

        if (dto.getLaboratoireId() != null) {
            laboratoire = laboratoireRepository.findById(dto.getLaboratoireId())
                    .orElseThrow(() -> new RuntimeException("Laboratoire non trouvé"));
        }

        if (dto.getServiceId() != null) {
            service = serviceRepository.findById(dto.getServiceId())
                    .orElseThrow(() -> new RuntimeException("Service non trouvé"));
        }

        Article article = new Article();

        article.setDesignation(dto.getDesignation());
        article.setNumeroInventaire(dto.getNumeroInventaire());
        article.setEtat(dto.getEtat());
        article.setDateAcquisition(dto.getDateAcquisition());
        article.setValeur(dto.getValeur());
        article.setCategorie(categorie);
        article.setLaboratoire(laboratoire);
        article.setService(service);


        Article articleSauvegarde = articleRepository.save(article);

        ArticleResponseDTO response = new ArticleResponseDTO();

        response.setId(articleSauvegarde.getId());
        response.setDesignation(articleSauvegarde.getDesignation());
        response.setNumeroInventaire(articleSauvegarde.getNumeroInventaire());
        response.setEtat(articleSauvegarde.getEtat());
        response.setDateAcquisition(articleSauvegarde.getDateAcquisition());
        response.setValeur(articleSauvegarde.getValeur());
        response.setCategorieId(articleSauvegarde.getCategorie().getId());
        response.setCategorieNom(articleSauvegarde.getCategorie().getNom());
        if (articleSauvegarde.getLaboratoire() != null) {
            response.setLaboratoireId(articleSauvegarde.getLaboratoire().getId());
            response.setAffectation(articleSauvegarde.getLaboratoire().getNom());
        }
        if (articleSauvegarde.getService() != null) {
            response.setServiceId(articleSauvegarde.getService().getId());
            response.setAffectation(articleSauvegarde.getService().getNom());

        }
        return response;

    }

    @Override
    public List<ArticleResponseDTO> findAllArticles() {
        List<Article> articles = articleRepository.findAll();
        return articles.stream()
                .map(article -> {

                    ArticleResponseDTO dto = new ArticleResponseDTO();

                    dto.setId(article.getId());
                    dto.setDesignation(article.getDesignation());
                    dto.setNumeroInventaire(article.getNumeroInventaire());
                    dto.setEtat(article.getEtat());
                    dto.setDateAcquisition(article.getDateAcquisition());
                    dto.setValeur(article.getValeur());
                    dto.setCategorieId(article.getCategorie().getId());
                    dto.setCategorieNom(article.getCategorie().getNom());
                    if (article.getLaboratoire() != null) {
                        dto.setLaboratoireId(article.getLaboratoire().getId());
                        dto.setAffectation(article.getLaboratoire().getNom());

                    }
                    if (article.getService() != null) {
                        dto.setServiceId(article.getService().getId());
                        dto.setAffectation(article.getService().getNom());

                    }
                    return dto;

                })
                .toList();
    }
@Override
   public ArticleResponseDTO findArticleById(Long id){
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article non trouvé"));
        ArticleResponseDTO dto = new ArticleResponseDTO();
        dto.setId(article.getId());
        dto.setDesignation(article.getDesignation());
        dto.setNumeroInventaire(article.getNumeroInventaire());
        dto.setEtat(article.getEtat());
        dto.setDateAcquisition(article.getDateAcquisition());
        dto.setValeur(article.getValeur());
        dto.setCategorieId(article.getCategorie().getId());
        dto.setCategorieNom(article.getCategorie().getNom());

    if (article.getLaboratoire() != null) {
        dto.setLaboratoireId(article.getLaboratoire().getId());
        dto.setAffectation(article.getLaboratoire().getNom());

    }

    if (article.getService() != null) {
        dto.setServiceId(article.getService().getId());
        dto.setAffectation(article.getService().getNom());

    }
        return dto;
    }
    @Override
    public ArticleResponseDTO modifierArticle(Long id ,ArticleRequestDTO dto){

        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article non trouvé"));
        Categorie categorie = categorieRepository.findById(dto.getCategorieId())
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));

        if (dto.getLaboratoireId() != null && dto.getServiceId() != null) {
            throw new RuntimeException("Un article ne peut appartenir qu'un laboratoire OU à un service.");
        }

        if (dto.getLaboratoireId() == null && dto.getServiceId() == null) {
            throw new RuntimeException("Veuillez choisir un laboratoire ou un service.");
        }

        Laboratoire laboratoire = null;
        ServiceOrganisationnel service = null;

        if (dto.getLaboratoireId() != null) {
            laboratoire = laboratoireRepository.findById(dto.getLaboratoireId())
                    .orElseThrow(() -> new RuntimeException("Laboratoire non trouvé"));
        }

        if (dto.getServiceId() != null) {
            service = serviceRepository.findById(dto.getServiceId())
                    .orElseThrow(() -> new RuntimeException("Service non trouvé"));
        }
        article.setDesignation(dto.getDesignation());
        article.setNumeroInventaire(dto.getNumeroInventaire());
        article.setEtat(dto.getEtat());
        article.setDateAcquisition(dto.getDateAcquisition());
        article.setValeur(dto.getValeur());
        article.setCategorie(categorie);
        article.setLaboratoire(laboratoire);
        article.setService(service);



        Article articleSauvegarde = articleRepository.save(article);

        ArticleResponseDTO response = new ArticleResponseDTO();

        response.setId(articleSauvegarde.getId());
        response.setDesignation(articleSauvegarde.getDesignation());
        response.setNumeroInventaire(articleSauvegarde.getNumeroInventaire());
        response.setEtat(articleSauvegarde.getEtat());
        response.setDateAcquisition(articleSauvegarde.getDateAcquisition());
        response.setValeur(articleSauvegarde.getValeur());
        response.setCategorieId(articleSauvegarde.getCategorie().getId());
        response.setCategorieNom(articleSauvegarde.getCategorie().getNom());

        if (articleSauvegarde.getLaboratoire() != null) {
            response.setLaboratoireId(articleSauvegarde.getLaboratoire().getId());
            response.setAffectation(articleSauvegarde.getLaboratoire().getNom());

        }

        if (articleSauvegarde.getService() != null) {
            response.setServiceId(articleSauvegarde.getService().getId());
            response.setAffectation(articleSauvegarde.getService().getNom());

        }
        return  response;
    }
    public void supprimerArticleByID(Long id){
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article non trouvé"));
        articleRepository.delete(article);
    }

}


