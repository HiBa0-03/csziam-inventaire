package ma.csziam.inventaire.Controllers;

import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.CategorieRequestDTO;
import ma.csziam.inventaire.Dto.CategorieResponseDTO;
import ma.csziam.inventaire.Services.CategorieService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor

public class CategorieController {
    final private CategorieService categorieService;

    @PostMapping
    @ResponseStatus (HttpStatus.CREATED)
    public CategorieResponseDTO createCategorie(@RequestBody CategorieRequestDTO DTO)
    {
        return categorieService.creeCategorie(DTO);

    }
    @GetMapping
    public List<CategorieResponseDTO> findAllCategories(){
        return categorieService.findAllCategories();
    }
    @GetMapping("/{id}")
    public CategorieResponseDTO findCategorieById(@PathVariable  Long id){
        return categorieService.findCategorieById(id);
    }
}
