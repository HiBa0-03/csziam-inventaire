package ma.csziam.inventaire.Services;


import ma.csziam.inventaire.Dto.CategorieRequestDTO;
import ma.csziam.inventaire.Dto.CategorieResponseDTO;

import java.util.List;

public interface CategorieService {
    CategorieResponseDTO creeCategorie(CategorieRequestDTO dto);
    CategorieResponseDTO findCategorieById(Long id);
    List<CategorieResponseDTO> findAllCategories();
    CategorieResponseDTO updateCategorieById(Long id, CategorieRequestDTO dto);
    void deleteCategorieById(Long id);

}
