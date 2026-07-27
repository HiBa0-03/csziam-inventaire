package ma.csziam.inventaire.Services;

import ma.csziam.inventaire.Dto.UtilisateurRequestDTO;
import ma.csziam.inventaire.Dto.UtilisateurResponseDTO;

import java.util.List;

public interface UtilisateurService {

    UtilisateurResponseDTO creerUtilisateur(UtilisateurRequestDTO utilisateurDTO);
    List<UtilisateurResponseDTO> getAllUtilisateurs();
    UtilisateurResponseDTO getUtilisateurByID(long utilisateurId);
    UtilisateurResponseDTO modifierUtilisateur(Long id, UtilisateurRequestDTO dto);
    String supprimerUtilisateurByID(Long id);

}
