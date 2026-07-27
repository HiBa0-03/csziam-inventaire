package ma.csziam.inventaire.Services;

import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.LaboratoireResponseDTO;
import ma.csziam.inventaire.Entities.Laboratoire;
import ma.csziam.inventaire.Repositories.LaboratoireRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LaboratoireServiceImpl implements LaboratoireService{


    final private LaboratoireRepository laboratoireRepository;
    @Override

    public List<LaboratoireResponseDTO> findAllLaboratoires()
    {
        List<Laboratoire> laboratoires = laboratoireRepository.findAll();
        return laboratoires.stream()
                .map(laboratoire-> {

                    LaboratoireResponseDTO dto = new  LaboratoireResponseDTO();

                    dto.setId(laboratoire.getId());
                    dto.setNom(laboratoire.getNom());
                    dto.setDescription(laboratoire.getDescription());
                    return dto;

                })
                .toList();
    }
    @Override

    public LaboratoireResponseDTO findLaboratoireById(Long id){
        Laboratoire laboratoire = laboratoireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("laboratoire non trouvée"));
        LaboratoireResponseDTO dto = new  LaboratoireResponseDTO();
        dto.setId(laboratoire.getId());
        dto.setNom(laboratoire.getNom());
        dto.setDescription(laboratoire.getDescription());
        return dto;

    }
}
