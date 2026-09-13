package ma.csziam.inventaire.Config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "CSZIAM - API de gestion d'inventaire",
                version = "1.0",
                description = "API REST pour la gestion du patrimoine, des inventaires, des mouvements et des utilisateurs du Centre CSZIAM.",
                contact = @Contact(
                        name = "Centre CSZIAM"
                )
        )
)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class SwaggerApiConfig {
}