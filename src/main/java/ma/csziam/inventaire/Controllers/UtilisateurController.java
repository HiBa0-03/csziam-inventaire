package ma.csziam.inventaire.Controllers;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/utilisateurs")
@RequiredArgsConstructor
@Tag(
        name = "Utilisateurs",
        description = "Gestion des utilisateurs du système d'inventaire"
)
@SecurityRequirement(name = "bearerAuth")
public class UtilisateurController {


        private final UtilisateurService utilisateurService;


        @PostMapping
        @ResponseStatus(HttpStatus.CREATED)
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(
                summary = "Créer un utilisateur",
                description = "Permet à un administrateur de créer un nouvel utilisateur."
        )
        public UtilisateurResponseDTO creerUtilisateur( @Valid @RequestBody UtilisateurRequestDTO utilisateurDTO) {
            return utilisateurService.creerUtilisateur(utilisateurDTO);
        }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Lister les utilisateurs",
            description = "Retourne la liste de tous les utilisateurs enregistrés dans le système."
    )
        public List<UtilisateurResponseDTO> getAllUtilisateurs(){
            return utilisateurService.getAllUtilisateurs();
        }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Consulter un utilisateur",
            description = "Retourne les informations d'un utilisateur à partir de son identifiant."
    )
    public UtilisateurResponseDTO getUtilisateurById( @Parameter(
            description = "Identifiant de l'utilisateur",
            example = "1"
    )@PathVariable Long id){
        return utilisateurService.getUtilisateurByID(id);
    }
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Modifier un utilisateur",
            description = "Permet à un administrateur de modifier les informations d'un utilisateur existant."
    )
    public UtilisateurResponseDTO updateUtilisateur( @Parameter(
            description = "Identifiant de l'utilisateur à modifier",
            example = "1"
    )@PathVariable Long id, @Valid @RequestBody UtilisateurUpdateRequestDTO  dto){
            return utilisateurService.modifierUtilisateur(id, dto);
  }
 @DeleteMapping("/{id}")
 @ResponseStatus(HttpStatus.NO_CONTENT)
 @PreAuthorize("hasRole('ADMIN')")
 @Operation(
         summary = "Supprimer un utilisateur",
         description = "Permet à un administrateur de supprimer un utilisateur existant."
 )
    public String deleteUtilisateur(
         @Parameter(
                 description = "Identifiant de l'utilisateur à supprimer",
                 example = "1"
         )@PathVariable Long id){
           return  utilisateurService.supprimerUtilisateurByID(id);
 }

}
