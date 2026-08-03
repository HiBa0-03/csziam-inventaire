package ma.csziam.inventaire.Controllers;

import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.CategorieRequestDTO;
import ma.csziam.inventaire.Dto.CategorieResponseDTO;
import ma.csziam.inventaire.Services.CategorieService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor

public class CategorieController {
    final private CategorieService categorieService;

    @PostMapping
    @ResponseStatus (HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public CategorieResponseDTO createCategorie(@RequestBody CategorieRequestDTO DTO)
    {
        return categorieService.creeCategorie(DTO);

    }
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    public List<CategorieResponseDTO> findAllCategories(){
        return categorieService.findAllCategories();
    }
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    public CategorieResponseDTO findCategorieById(@PathVariable  Long id){
        return categorieService.findCategorieById(id);
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public CategorieResponseDTO updateCategorie(
            @PathVariable Long id,
            @RequestBody CategorieRequestDTO dto) {

        return categorieService.updateCategorieById(id, dto);
    }
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteCategorie(@PathVariable Long id) {

        categorieService.deleteCategorieById(id);
    }
}
