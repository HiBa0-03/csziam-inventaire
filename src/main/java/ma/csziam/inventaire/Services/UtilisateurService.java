package ma.csziam.inventaire.Services;

import ma.csziam.inventaire.Dto.UtilisateurRequestDTO;
import ma.csziam.inventaire.Dto.UtilisateurResponseDTO;
import ma.csziam.inventaire.Dto.UtilisateurUpdateRequestDTO;

import java.util.List;

public interface UtilisateurService {

    UtilisateurResponseDTO creerUtilisateur(UtilisateurRequestDTO utilisateurDTO);
    List<UtilisateurResponseDTO> getAllUtilisateurs();
    UtilisateurResponseDTO getUtilisateurByID(long utilisateurId);
    UtilisateurResponseDTO modifierUtilisateur(Long id, UtilisateurUpdateRequestDTO  dto);
    String supprimerUtilisateurByID(Long id);

}
