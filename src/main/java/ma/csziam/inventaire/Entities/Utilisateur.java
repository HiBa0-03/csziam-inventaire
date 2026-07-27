package ma.csziam.inventaire.Entities;
import ma.csziam.inventaire.Enums.RoleUtilisateur;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "utilisateurs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @Column(unique = true)
    private String email;

    private String motDePasse;

    private String telephone;

    @Enumerated(EnumType.STRING)
    private RoleUtilisateur roleUtilisateur;
}