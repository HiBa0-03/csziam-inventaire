package ma.csziam.inventaire.Services;

import ma.csziam.inventaire.Dto.CampagneRequestDTO;
import ma.csziam.inventaire.Dto.CampagneResponseDTO;

import java.util.List;

public interface CampagneService {

    List<CampagneResponseDTO> findAllCampagnes();
    CampagneResponseDTO findCampagneById(Long id);
  CampagneResponseDTO findCampagneByYear(int annee);
  CampagneResponseDTO creerCampagne(CampagneRequestDTO campagneRequestDTO);
}
