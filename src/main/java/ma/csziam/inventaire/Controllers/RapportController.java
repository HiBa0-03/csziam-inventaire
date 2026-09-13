package ma.csziam.inventaire.Controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import ma.csziam.inventaire.Dto.RapportStatistiquesDTO;
import ma.csziam.inventaire.Services.RapportPdfService;
import ma.csziam.inventaire.Services.RapportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rapports")
@RequiredArgsConstructor
@Tag(
        name = "Rapports",
        description = "Consultation des statistiques et génération des rapports d'inventaire"
)
@SecurityRequirement(name = "bearerAuth")
public class RapportController {

    private final RapportPdfService rapportPdfService;
    private final RapportService rapportService;

    @GetMapping("/statistiques")
    @Operation(
            summary = "Calculer les statistiques",
            description = "Retourne les statistiques globales concernant les articles, les mouvements, les inventaires et les utilisateurs."
    )
    public ResponseEntity<RapportStatistiquesDTO> calculerStatistiques() {

        RapportStatistiquesDTO statistiques = rapportService.calculerStatistiques();
        return ResponseEntity.ok(statistiques);
    }

    @PostMapping("/generer")
    @Operation(
            summary = "Générer un rapport",
            description = "Génère un rapport d'inventaire à partir des statistiques disponibles."
    )
    public ResponseEntity<String> genererRapport() {

        String rapport = rapportService.genererRapport();
        return ResponseEntity.ok(rapport);
    }

    @GetMapping("/pdf")
    @Operation(
            summary = "Télécharger le rapport PDF",
            description = "Génère et retourne le dernier rapport d'inventaire au format PDF."
    )
    public ResponseEntity<byte[]> genererPdf() {

        String rapport = rapportService.getDernierRapport();

        byte[] pdf = rapportPdfService.genererPdf(rapport);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=rapport-inventaire-2026.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}