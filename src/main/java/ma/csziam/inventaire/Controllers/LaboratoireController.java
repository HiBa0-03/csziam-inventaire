package ma.csziam.inventaire.Controllers;

import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.LaboratoireResponseDTO;
import ma.csziam.inventaire.Services.LaboratoireService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/laboratoires")
@RequiredArgsConstructor
public class LaboratoireController {
    final private LaboratoireService laboratoireService;
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    public LaboratoireResponseDTO getLaboratoire(@PathVariable Long id) {
        return laboratoireService.findLaboratoireById(id);
    }
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    public List < LaboratoireResponseDTO> getAllLaboratoires() {
        return laboratoireService.findAllLaboratoires();
    }
}
