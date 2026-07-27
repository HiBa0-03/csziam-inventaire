package ma.csziam.inventaire.Controllers;

import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.LaboratoireResponseDTO;
import ma.csziam.inventaire.Services.LaboratoireService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/laboratoires")
@RequiredArgsConstructor
public class LaboratoireController {
    final private LaboratoireService laboratoireService;
    @GetMapping("/{id}")
    public LaboratoireResponseDTO getLaboratoire(@PathVariable Long id) {
        return laboratoireService.findLaboratoireById(id);
    }
    @GetMapping
    public List < LaboratoireResponseDTO> getAllLaboratoires() {
        return laboratoireService.findAllLaboratoires();
    }
}
