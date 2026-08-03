package ma.csziam.inventaire.Controllers;

import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.MouvementRequestDTO;
import ma.csziam.inventaire.Dto.MouvementResponseDTO;
import ma.csziam.inventaire.Services.MouvementService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mouvements")
@RequiredArgsConstructor
public class MouvementController {
    final MouvementService mouvementService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public MouvementResponseDTO createMouvement(@RequestBody MouvementRequestDTO request) {
        return mouvementService.creeMouvement(request);
    }
}
