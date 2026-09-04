package ma.csziam.inventaire.Controllers;

import jakarta.validation.Valid;
import ma.csziam.inventaire.Dto.UtilisateurUpdateRequestDTO;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

import ma.csziam.inventaire.Dto.UtilisateurRequestDTO;
import ma.csziam.inventaire.Dto.UtilisateurResponseDTO;
import ma.csziam.inventaire.Services.UtilisateurService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/utilisateurs")
@RequiredArgsConstructor
public class UtilisateurController {


        private final UtilisateurService utilisateurService;


        @PostMapping
        @ResponseStatus(HttpStatus.CREATED)
        @PreAuthorize("hasRole('ADMIN')")
        public UtilisateurResponseDTO creerUtilisateur( @Valid @RequestBody UtilisateurRequestDTO utilisateurDTO) {
            return utilisateurService.creerUtilisateur(utilisateurDTO);
        }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
        public List<UtilisateurResponseDTO> getAllUtilisateurs(){
            return utilisateurService.getAllUtilisateurs();
        }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public UtilisateurResponseDTO getUtilisateurById(@PathVariable Long id){
        return utilisateurService.getUtilisateurByID(id);
    }
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public UtilisateurResponseDTO updateUtilisateur(@PathVariable Long id, @Valid @RequestBody UtilisateurUpdateRequestDTO  dto){
            return utilisateurService.modifierUtilisateur(id, dto);
  }
 @DeleteMapping("/{id}")
 @ResponseStatus(HttpStatus.NO_CONTENT)
 @PreAuthorize("hasRole('ADMIN')")
    public String deleteUtilisateur(@PathVariable Long id){
           return  utilisateurService.supprimerUtilisateurByID(id);
 }

}
