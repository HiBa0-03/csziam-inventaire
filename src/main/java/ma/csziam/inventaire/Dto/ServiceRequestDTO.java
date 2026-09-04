package ma.csziam.inventaire.Dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServiceRequestDTO {

    @NotBlank(message = "Le nom du service est obligatoire")
    private String nom;

    private String description;
}


