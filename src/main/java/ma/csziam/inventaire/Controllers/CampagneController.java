package ma.csziam.inventaire.Controllers;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.CampagneRequestDTO;
import ma.csziam.inventaire.Dto.CampagneResponseDTO;
import ma.csziam.inventaire.Services.CampagneService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/campagnes")
@RequiredArgsConstructor
public class CampagneController {
    final private CampagneService campagneService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CampagneResponseDTO createCampagne(@RequestBody CampagneRequestDTO campagneRequestDTO) {
        return campagneService.creerCampagne(campagneRequestDTO);
    }

    @GetMapping
    public List<CampagneResponseDTO> findAllCampagnes() {
        return campagneService.findAllCampagnes();
    }
    @GetMapping("/{id}")
    public CampagneResponseDTO findCampagneById(@PathVariable Long id) {
        return  campagneService.findCampagneById(id);
    }
    @GetMapping ("/annee/{annee}")
    public CampagneResponseDTO findCampagneByYear(@PathVariable int annee) {
        return campagneService.findCampagneByYear(annee);
    }
}
