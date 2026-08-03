package ma.csziam.inventaire.Services;

import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.CategorieRequestDTO;
import ma.csziam.inventaire.Dto.CategorieResponseDTO;
import ma.csziam.inventaire.Repositories.CategorieRepository;
import org.springframework.stereotype.Service;
import ma.csziam.inventaire.Entities.Categorie;

import java.util.List;


@Service
@RequiredArgsConstructor
public class CategorieServiceImpl implements CategorieService{
     private final CategorieRepository categorieRepository;
@Override
   public CategorieResponseDTO creeCategorie(CategorieRequestDTO dto) {
       Categorie categorie = new Categorie();

       categorie.setNom(dto.getNom());
       categorie.setDescription(dto.getDescription());

       Categorie categorieSauvegarde = categorieRepository.save(categorie);

       CategorieResponseDTO response = new CategorieResponseDTO();

       response.setId(categorieSauvegarde .getId());
       response.setNom(categorieSauvegarde.getNom());
       response.setDescription(categorieSauvegarde .getDescription());
        return response;
    }
    @Override
    public CategorieResponseDTO findCategorieById(Long id){
        Categorie categorie = categorieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
        CategorieResponseDTO dto = new  CategorieResponseDTO();
        dto.setId(categorie.getId());
        dto.setNom(categorie.getNom());
        dto.setDescription(categorie.getDescription());
       return dto;

    }
    @Override
    public List<CategorieResponseDTO> findAllCategories(){
        List<Categorie> categories = categorieRepository.findAll();
        return categories.stream()
                .map(categorie-> {

                    CategorieResponseDTO dto = new  CategorieResponseDTO();

                    dto.setId(categorie.getId());
                    dto.setNom(categorie.getNom());
                    dto.setDescription(categorie.getDescription());
                    return dto;

                })
                .toList();

    }
    @Override
    public CategorieResponseDTO updateCategorieById(Long id, CategorieRequestDTO dto) {

        Categorie categorie = categorieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));

        categorie.setNom(dto.getNom());
        categorie.setDescription(dto.getDescription());

        Categorie categorieSauvegarde = categorieRepository.save(categorie);

        CategorieResponseDTO response = new CategorieResponseDTO();
        response.setId(categorieSauvegarde.getId());
        response.setNom(categorieSauvegarde.getNom());
        response.setDescription(categorieSauvegarde.getDescription());

        return response;
    }

    @Override
    public void deleteCategorieById(Long id) {

        Categorie categorie = categorieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));

        categorieRepository.delete(categorie);
    }

}
