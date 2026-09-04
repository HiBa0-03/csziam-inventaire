package ma.csziam.inventaire.Controllers;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.CampagneRequestDTO;
import ma.csziam.inventaire.Dto.CampagneResponseDTO;
import ma.csziam.inventaire.Services.CampagneService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/campagnes")
@RequiredArgsConstructor
public class CampagneController {
    final private CampagneService campagneService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public CampagneResponseDTO createCampagne(@RequestBody CampagneRequestDTO campagneRequestDTO) {
        return campagneService.creerCampagne(campagneRequestDTO);
    }
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    public List<CampagneResponseDTO> findAllCampagnes() {
        return campagneService.findAllCampagnes();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    public CampagneResponseDTO findCampagneById(@PathVariable Long id) {
        return campagneService.findCampagneById(id);
    }

    @GetMapping("/annee/{annee}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    public CampagneResponseDTO findCampagneByYear(@PathVariable int annee) {
        return campagneService.findCampagneByYear(annee);
    }
}
