package ma.csziam.inventaire.Dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LaboratoireRequestDTO {

    @NotBlank(message = "Le nom du laboratoire est obligatoire")
    private String nom;

    private String description;
}
