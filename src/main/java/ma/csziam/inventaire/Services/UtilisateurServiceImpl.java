package ma.csziam.inventaire.Services;

import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.UtilisateurRequestDTO;
import ma.csziam.inventaire.Dto.UtilisateurResponseDTO;
import ma.csziam.inventaire.Entities.Utilisateur;
import ma.csziam.inventaire.Repositories.UtilisateurRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UtilisateurServiceImpl implements  UtilisateurService {
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    public UtilisateurResponseDTO creerUtilisateur(UtilisateurRequestDTO utilisateurDTO) {

        Utilisateur utilisateur = new Utilisateur();

        utilisateur.setNom(utilisateurDTO.getNom());
        utilisateur.setEmail(utilisateurDTO.getEmail());
        utilisateur.setMotDePasse(passwordEncoder.encode(utilisateurDTO.getMotDePasse()));
        utilisateur.setTelephone(utilisateurDTO.getTelephone());
        utilisateur.setRoleUtilisateur(utilisateurDTO.getRoleUtilisateur());


        Utilisateur utilisateurSauvegarde = utilisateurRepository.save(utilisateur);


        UtilisateurResponseDTO response = new UtilisateurResponseDTO();

        response.setId(utilisateurSauvegarde.getId());
        response.setNom(utilisateurSauvegarde.getNom());
        response.setEmail(utilisateurSauvegarde.getEmail());
        response.setTelephone(utilisateurSauvegarde.getTelephone());
        response.setRoleUtilisateur(utilisateurSauvegarde.getRoleUtilisateur());


        return response;
    }
    @Override
    public List<UtilisateurResponseDTO> getAllUtilisateurs() {

        List<Utilisateur> utilisateurs = utilisateurRepository.findAll();

        return utilisateurs.stream()
                .map(utilisateur -> {

                    UtilisateurResponseDTO dto = new UtilisateurResponseDTO();

                    dto.setId(utilisateur.getId());
                    dto.setNom(utilisateur.getNom());
                    dto.setEmail(utilisateur.getEmail());
                    dto.setTelephone(utilisateur.getTelephone());
                    dto.setRoleUtilisateur(utilisateur.getRoleUtilisateur());

                    return dto;

                })
                .toList();
    }
    @Override
    public  UtilisateurResponseDTO getUtilisateurByID(long utilisateurId){

        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        UtilisateurResponseDTO dto = new UtilisateurResponseDTO();

        dto.setId(utilisateur.getId());
        dto.setNom(utilisateur.getNom());
        dto.setEmail(utilisateur.getEmail());
        dto.setTelephone(utilisateur.getTelephone());
        dto.setRoleUtilisateur(utilisateur.getRoleUtilisateur());

        return dto;
    }

    @Override
    public UtilisateurResponseDTO modifierUtilisateur(Long id, UtilisateurRequestDTO dto) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        utilisateur.setNom(dto.getNom());
        utilisateur.setEmail(dto.getEmail());
        //meme si le pwd n'est pas modifier il ne  peux pas etre remplacer automatiquement
        if (dto.getMotDePasse() != null && !dto.getMotDePasse().isBlank()) {
            utilisateur.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));
        }
        utilisateur.setTelephone(dto.getTelephone());
        utilisateur.setRoleUtilisateur(dto.getRoleUtilisateur());

        Utilisateur utilisateurSauvegarde = utilisateurRepository.save(utilisateur);
        UtilisateurResponseDTO response = new UtilisateurResponseDTO();

        response.setId(utilisateurSauvegarde.getId());
        response.setNom(utilisateurSauvegarde.getNom());
        response.setEmail(utilisateurSauvegarde.getEmail());
        response.setTelephone(utilisateurSauvegarde.getTelephone());
        response.setRoleUtilisateur(utilisateurSauvegarde.getRoleUtilisateur());
        return response;
    }
    @Override
    public String supprimerUtilisateurByID(Long id){
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        utilisateurRepository.delete(utilisateur);
        return "Utilisateur supprimé avec succès";

    }

}
