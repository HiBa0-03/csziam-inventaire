package ma.csziam.inventaire.Controllers;

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
        //cree un utilisateur
        public UtilisateurResponseDTO creerUtilisateur(@RequestBody UtilisateurRequestDTO utilisateurDTO) {

            return utilisateurService.creerUtilisateur(utilisateurDTO);
        }

    @GetMapping
        public List<UtilisateurResponseDTO> getAllUtilisateurs(){

            return utilisateurService.getAllUtilisateurs();

        }

    @GetMapping("/{id}")
    public UtilisateurResponseDTO getUtilisateurById(
            @PathVariable Long id
    ){

        return utilisateurService.getUtilisateurByID(id);

    }
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UtilisateurResponseDTO updateUtilisateur(@PathVariable Long id,@RequestBody UtilisateurRequestDTO dto){
            return utilisateurService.modifierUtilisateur(id, dto);
  }
 @DeleteMapping("/{id}")
 @ResponseStatus(HttpStatus.NO_CONTENT)
    public String deleteUtilisateur(@PathVariable Long id){
           return  utilisateurService.supprimerUtilisateurByID(id);
 }



}
