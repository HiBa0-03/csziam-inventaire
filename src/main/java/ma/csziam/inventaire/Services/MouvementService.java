package ma.csziam.inventaire.Services;

import ma.csziam.inventaire.Dto.MouvementRequestDTO;
import ma.csziam.inventaire.Dto.MouvementResponseDTO;
import ma.csziam.inventaire.Entities.Article;

import java.util.List;

public interface MouvementService {

    MouvementResponseDTO creeMouvement(MouvementRequestDTO requestDTO );
    List<MouvementResponseDTO >findAllMouvements();
}
