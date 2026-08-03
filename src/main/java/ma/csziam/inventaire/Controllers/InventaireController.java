package ma.csziam.inventaire.Controllers;

import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.InventaireRequestDTO;
import ma.csziam.inventaire.Dto.InventaireResponseDTO;
import ma.csziam.inventaire.Services.InventaireService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventaires")
@RequiredArgsConstructor
public class InventaireController {

    private final InventaireService inventaireService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('AGENT_INVENTAIRE')")
    public InventaireResponseDTO creerInventaire(@RequestBody InventaireRequestDTO dto) {
        return inventaireService.creerInventaire(dto);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    public List<InventaireResponseDTO> findAllInventaires() {
        return inventaireService.findAllInventaires();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE','AGENT_INVENTAIRE')")
    public InventaireResponseDTO findInventaireById(@PathVariable Long id) {
        return inventaireService.findInventaireById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('AGENT_INVENTAIRE')")
    public InventaireResponseDTO modifierInventaire(@PathVariable Long id,
                                                    @RequestBody InventaireRequestDTO dto) {
        return inventaireService.modifierInventaire(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('AGENT_INVENTAIRE')")
    public void supprimerInventaire(@PathVariable Long id) {
        inventaireService.supprimerInventaire(id);
    }
}