package ma.csziam.inventaire.Services;


import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.CampagneRequestDTO;
import ma.csziam.inventaire.Dto.CampagneResponseDTO;
import ma.csziam.inventaire.Entities.CampagneInventaire;
import ma.csziam.inventaire.Repositories.CampagneRepository;
import org.springframework.stereotype.Service;
import ma.csziam.inventaire.Enums.StatutInventaire;

import java.util.List;

@Service
@RequiredArgsConstructor

public class CampagneServiceImpl implements CampagneService {

    final private CampagneRepository campagneRepository;

    @Override
    public List<CampagneResponseDTO> findAllCampagnes(){
        List<CampagneInventaire> campagnes = campagneRepository.findAll();
        return campagnes.stream()
                .map(campagne -> {
                    CampagneResponseDTO  dto = new  CampagneResponseDTO();

                    dto.setId(campagne.getId());
                    dto.setAnnee(campagne.getAnnee());
                    dto.setDateDebut(campagne.getDateDebut());
                    dto.setDateFin(campagne.getDateFin());
                    dto.setStatut(campagne.getStatut());

                    return dto;

                })
                .toList();
    }
    @Override
    public CampagneResponseDTO findCampagneById(Long id){
        CampagneInventaire campagne= campagneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("campagne non trouvé"));
        CampagneResponseDTO dto = new CampagneResponseDTO();
        dto.setId(campagne.getId());
        dto.setAnnee(campagne.getAnnee());
        dto.setDateDebut(campagne.getDateDebut());
        dto.setDateFin(campagne.getDateFin());
        dto.setStatut(campagne.getStatut());

        return dto;
    }

    @Override
    public CampagneResponseDTO findCampagneByYear(int annee){
        CampagneInventaire campagne= campagneRepository.findByAnnee(annee)
                .orElseThrow(() -> new RuntimeException("campagne non trouvé"));
        CampagneResponseDTO dto = new CampagneResponseDTO();
        dto.setId(campagne.getId());
        dto.setAnnee(campagne.getAnnee());
        dto.setDateDebut(campagne.getDateDebut());
        dto.setDateFin(campagne.getDateFin());
        dto.setStatut(campagne.getStatut());

        return  dto ;
    }
    @Override
    public CampagneResponseDTO creerCampagne(CampagneRequestDTO campagneRequestDTO){
        if (campagneRepository.findByAnnee(campagneRequestDTO.getAnnee()).isPresent()) {
            throw new RuntimeException("Une campagne existe déjà pour cette année.");
        }
        CampagneInventaire campagne= new CampagneInventaire();
        campagne.setAnnee(campagneRequestDTO.getAnnee());
        campagne.setDateDebut(campagneRequestDTO.getDateDebut());
        campagne.setDateFin(campagneRequestDTO.getDateFin());
        campagne.setStatut(StatutInventaire.EN_COURS);
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
