package ma.csziam.inventaire.Services;

import ma.csziam.inventaire.Dto.InventaireRequestDTO;
import ma.csziam.inventaire.Dto.InventaireResponseDTO;

import java.util.List;

public interface InventaireService {

    List<InventaireResponseDTO> findAllInventaires();

    InventaireResponseDTO findInventaireById(Long id);

    InventaireResponseDTO creerInventaire(InventaireRequestDTO dto);

    InventaireResponseDTO modifierInventaire(Long id, InventaireRequestDTO dto);

    void supprimerInventaire(Long id);
}