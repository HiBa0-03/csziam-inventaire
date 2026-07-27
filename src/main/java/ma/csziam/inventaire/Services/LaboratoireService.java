package ma.csziam.inventaire.Services;

import ma.csziam.inventaire.Dto.LaboratoireResponseDTO;

import java.util.List;

public interface LaboratoireService {
    List<LaboratoireResponseDTO> findAllLaboratoires();
    LaboratoireResponseDTO findLaboratoireById(Long id);
}
