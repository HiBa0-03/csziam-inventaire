package ma.csziam.inventaire.Services;


import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.CampagneRequestDTO;
import ma.csziam.inventaire.Dto.CampagneResponseDTO;
import ma.csziam.inventaire.Entities.CampagneInventaire;
import ma.csziam.inventaire.Repositories.ArticleRepository;
import ma.csziam.inventaire.Repositories.CampagneRepository;
import ma.csziam.inventaire.Repositories.InventaireRepository;
import org.springframework.stereotype.Service;
import ma.csziam.inventaire.Enums.StatutInventaire;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor

public class CampagneServiceImpl implements CampagneService {

    final private CampagneRepository campagneRepository;
    final private ArticleRepository articleRepository;
    final private InventaireRepository inventaireRepository;
    private StatutInventaire calculerStatut(
            CampagneInventaire campagne
    ) {

        LocalDate aujourdHui = LocalDate.now();

        long totalArticles = articleRepository.count();

        long articlesInventories = inventaireRepository.countByCampagneId(campagne.getId());
        if (
                totalArticles > 0 && articlesInventories >= totalArticles
        ) {
            return StatutInventaire.TERMINE;
        }
        if (aujourdHui.isBefore(campagne.getDateDebut())) {

            return StatutInventaire.AVENIR;

        }
        if (aujourdHui.isAfter(campagne.getDateFin())) {

            return StatutInventaire.EXPIREE;

        }
        return StatutInventaire.EN_COURS;
    }

    @Override
    public List<CampagneResponseDTO> findAllCampagnes(){
        List<CampagneInventaire> campagnes = campagneRepository.findAll();
        long totalArticles = articleRepository.count();

        return campagnes.stream()
                .map(campagne -> {
                    StatutInventaire statut = calculerStatut(campagne);
                    long articlesInventories = inventaireRepository.countByCampagneId(campagne.getId());
                    double progression = totalArticles == 0 ? 0 : (articlesInventories * 100.0) / totalArticles;
                    CampagneResponseDTO  dto = new  CampagneResponseDTO();

                    dto.setId(campagne.getId());
                    dto.setAnnee(campagne.getAnnee());
                    dto.setDateDebut(campagne.getDateDebut());
                    dto.setDateFin(campagne.getDateFin());
                    dto.setStatut(statut);
                    dto.setTotalArticles(totalArticles);
                    dto.setArticlesInventories(articlesInventories);
                    dto.setProgression(progression);

                    return dto;

                })
                .toList();
    }
    @Override
    public CampagneResponseDTO findCampagneById(Long id){
        CampagneInventaire campagne= campagneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("campagne non trouvé"));
        long totalArticles = articleRepository.count();
        long articlesInventories = inventaireRepository.countByCampagneId(id);
        double progression = totalArticles == 0 ? 0 : (articlesInventories * 100.0) / totalArticles;

        StatutInventaire statut = calculerStatut(campagne);

        CampagneResponseDTO dto = new CampagneResponseDTO();
        dto.setId(campagne.getId());
        dto.setAnnee(campagne.getAnnee());
        dto.setDateDebut(campagne.getDateDebut());
        dto.setDateFin(campagne.getDateFin());
        dto.setStatut(statut);
        dto.setTotalArticles(totalArticles);
        dto.setArticlesInventories(articlesInventories);
        dto.setProgression(progression);

        return dto;
    }

    @Override
    public CampagneResponseDTO findCampagneByYear(int annee){
        CampagneInventaire campagne= campagneRepository.findByAnnee(annee)
                .orElseThrow(() -> new RuntimeException("campagne non trouvé"));
        return findCampagneById(campagne.getId());
    }
    @Override
    public CampagneResponseDTO creerCampagne(CampagneRequestDTO campagneRequestDTO){
             if (campagneRepository.findByAnnee(campagneRequestDTO.getAnnee()).isPresent()) {
            throw new RuntimeException("Une campagne existe déjà pour cette année.");
        }
            if (campagneRequestDTO.getDateFin().isBefore(campagneRequestDTO.getDateDebut())) {
            throw new RuntimeException("La date de fin doit être après la date de début.");
        }
            if (campagneRequestDTO.getDateDebut().getYear() != campagneRequestDTO.getAnnee()) {
                throw new RuntimeException("La date de début doit appartenir à l'année de la campagne.");
            }

            if ( campagneRequestDTO.getDateFin().getYear() != campagneRequestDTO.getAnnee()) {
                throw new RuntimeException("La date de fin doit appartenir à l'année de la campagne.");

            }

        CampagneInventaire campagne= new CampagneInventaire();
        campagne.setAnnee(campagneRequestDTO.getAnnee());
        campagne.setDateDebut(campagneRequestDTO.getDateDebut());
        campagne.setDateFin(campagneRequestDTO.getDateFin());
        LocalDate aujourdHui = LocalDate.now();

        if (aujourdHui.isBefore(campagne.getDateDebut())) {
            campagne.setStatut(StatutInventaire.AVENIR);
        } else if (aujourdHui.isAfter(campagne.getDateFin())) {
            campagne.setStatut(StatutInventaire.EXPIREE);
        } else {
            campagne.setStatut(StatutInventaire.EN_COURS);
        }
        CampagneInventaire campagneInventaireSauvegarde= campagneRepository.save(campagne);
        CampagneResponseDTO dto = new CampagneResponseDTO();
        dto.setId(campagneInventaireSauvegarde.getId());
        dto.setAnnee(campagneInventaireSauvegarde.getAnnee());
        dto.setDateDebut(campagneInventaireSauvegarde.getDateDebut());
        dto.setDateFin(campagneInventaireSauvegarde.getDateFin());
        dto.setStatut(campagneInventaireSauvegarde.getStatut());
        return  dto ;

    }


}
