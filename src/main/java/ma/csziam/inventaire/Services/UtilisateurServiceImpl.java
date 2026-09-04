package ma.csziam.inventaire.Services;

import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.UtilisateurRequestDTO;
import ma.csziam.inventaire.Dto.UtilisateurResponseDTO;
import ma.csziam.inventaire.Entities.Laboratoire;
import ma.csziam.inventaire.Entities.ServiceOrganisationnel;
import ma.csziam.inventaire.Entities.Utilisateur;
import ma.csziam.inventaire.Enums.RoleUtilisateur;
import ma.csziam.inventaire.Repositories.LaboratoireRepository;
import ma.csziam.inventaire.Repositories.ServiceOrganisationnelRepository;
import ma.csziam.inventaire.Repositories.UtilisateurRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ma.csziam.inventaire.Dto.UtilisateurUpdateRequestDTO;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UtilisateurServiceImpl implements  UtilisateurService {
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final LaboratoireRepository laboratoireRepository;
    private final ServiceOrganisationnelRepository serviceRepository;


    @Override
    public UtilisateurResponseDTO creerUtilisateur(UtilisateurRequestDTO utilisateurDTO) {
            if (utilisateurDTO.getRoleUtilisateur() == RoleUtilisateur.RESPONSABLE) {

                if (utilisateurDTO.getLaboratoireId() != null && utilisateurDTO.getServiceId() != null) {
                    throw new RuntimeException("Un responsable ne peut être affecté qu'à un laboratoire OU à un service.");}

                if (utilisateurDTO.getLaboratoireId() == null && utilisateurDTO.getServiceId() == null) {
                    throw new RuntimeException("Un responsable doit être affecté à un laboratoire ou à un service.");
                }}

            Laboratoire laboratoire = null;
            ServiceOrganisationnel service = null;

            if (utilisateurDTO.getLaboratoireId() != null) {
                laboratoire = laboratoireRepository.findById(utilisateurDTO.getLaboratoireId()).orElseThrow(() -> new RuntimeException("Laboratoire non trouvé"));}

            if (utilisateurDTO.getServiceId() != null) {
                service = serviceRepository.findById(utilisateurDTO.getServiceId()).orElseThrow(() -> new RuntimeException("Service non trouvé"));
            }
         Utilisateur utilisateur = new Utilisateur();

            utilisateur.setNom(utilisateurDTO.getNom());
            utilisateur.setEmail(utilisateurDTO.getEmail());
            utilisateur.setMotDePasse(passwordEncoder.encode(utilisateurDTO.getMotDePasse()));
            utilisateur.setTelephone(utilisateurDTO.getTelephone());
            utilisateur.setRoleUtilisateur(utilisateurDTO.getRoleUtilisateur());
            utilisateur.setLaboratoire(laboratoire);
            utilisateur.setService(service);

        Utilisateur utilisateurSauvegarde = utilisateurRepository.save(utilisateur);

        UtilisateurResponseDTO response = new UtilisateurResponseDTO();

        response.setId(utilisateurSauvegarde.getId());
        response.setNom(utilisateurSauvegarde.getNom());
        response.setEmail(utilisateurSauvegarde.getEmail());
        response.setTelephone(utilisateurSauvegarde.getTelephone());
        response.setRoleUtilisateur(utilisateurSauvegarde.getRoleUtilisateur());
        response.setLaboratoireId(utilisateurSauvegarde.getLaboratoire() != null ? utilisateurSauvegarde.getLaboratoire().getId() : null);
        response.setServiceId(utilisateurSauvegarde.getService() != null ? utilisateurSauvegarde.getService().getId(): null);
        response.setLaboratoireNom(utilisateurSauvegarde.getLaboratoire() != null? utilisateurSauvegarde.getLaboratoire().getNom() : null);
        response.setServiceNom(utilisateurSauvegarde.getService() != null ? utilisateurSauvegarde.getService().getNom() : null);

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
                    if (utilisateur.getLaboratoire() != null) {
                        dto.setLaboratoireId(utilisateur.getLaboratoire().getId());
                        dto.setLaboratoireNom(utilisateur.getLaboratoire().getNom());
                    } else {
                        dto.setLaboratoireId(null);
                        dto.setLaboratoireNom(null);
                    }
                    if (utilisateur.getService() != null) {
                        dto.setServiceId(utilisateur.getService().getId());
                        dto.setServiceNom(utilisateur.getService().getNom());
                    } else {
                        dto.setServiceId(null);
                        dto.setServiceNom(null);
                    }




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
        if (utilisateur.getLaboratoire() != null) {
            dto.setLaboratoireId(utilisateur.getLaboratoire().getId());
            dto.setLaboratoireNom(utilisateur.getLaboratoire().getNom());
        } else {
            dto.setLaboratoireId(null);
            dto.setLaboratoireNom(null);
        }

        if (utilisateur.getService() != null) {
            dto.setServiceId(utilisateur.getService().getId());
            dto.setServiceNom(utilisateur.getService().getNom());
        } else {
            dto.setServiceId(null);
            dto.setServiceNom(null);
        }


        return dto;
    }

    @Override
    public UtilisateurResponseDTO modifierUtilisateur(Long id,  UtilisateurUpdateRequestDTO dto) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        if (dto.getRoleUtilisateur() == RoleUtilisateur.RESPONSABLE) {

            if (dto.getLaboratoireId() != null && dto.getServiceId() != null) {
                throw new RuntimeException("Un responsable ne peut être affecté qu'à un laboratoire OU à un service.");
            }

            if (dto.getLaboratoireId() == null && dto.getServiceId() == null) {
                throw new RuntimeException("Un responsable doit être affecté à un laboratoire ou à un service.");}
        }

        Laboratoire laboratoire = null;
        ServiceOrganisationnel service = null;

        if (dto.getLaboratoireId() != null) {
            laboratoire = laboratoireRepository.findById(dto.getLaboratoireId()).orElseThrow(() -> new RuntimeException("Laboratoire non trouvé"));
        }
        if (dto.getServiceId() != null) {
            service = serviceRepository.findById(dto.getServiceId()).orElseThrow(() -> new RuntimeException("Service non trouvé"));
        }

        utilisateur.setNom(dto.getNom());
        utilisateur.setEmail(dto.getEmail());
        //meme si le pwd n'est pas modifier il ne  peux pas etre remplacer par un autre mot de passe auto
        if (dto.getMotDePasse() != null && !dto.getMotDePasse().isBlank()) {
            utilisateur.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));
        }
        utilisateur.setTelephone(dto.getTelephone());
        utilisateur.setRoleUtilisateur(dto.getRoleUtilisateur());
        utilisateur.setLaboratoire(laboratoire);
        utilisateur.setService(service);

        Utilisateur utilisateurSauvegarde = utilisateurRepository.save(utilisateur);
        UtilisateurResponseDTO response = new UtilisateurResponseDTO();

        response.setId(utilisateurSauvegarde.getId());
        response.setNom(utilisateurSauvegarde.getNom());
        response.setEmail(utilisateurSauvegarde.getEmail());
        response.setTelephone(utilisateurSauvegarde.getTelephone());
        response.setRoleUtilisateur(utilisateurSauvegarde.getRoleUtilisateur());
        response.setServiceId(utilisateurSauvegarde.getService() != null
                        ? utilisateurSauvegarde.getService().getId() : null);

        response.setLaboratoireId(utilisateurSauvegarde.getLaboratoire() != null
                        ? utilisateurSauvegarde.getLaboratoire().getId() : null);

        response.setServiceNom(utilisateurSauvegarde.getService() != null
                        ? utilisateurSauvegarde.getService().getNom() : null);

        response.setLaboratoireNom(utilisateurSauvegarde.getLaboratoire() != null
                        ? utilisateurSauvegarde.getLaboratoire().getNom(): null);
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
