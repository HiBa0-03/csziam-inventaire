package ma.csziam.inventaire.Entities;
import jakarta.persistence.*;
import lombok.*;
import ma.csziam.inventaire.Enums.StatutPresence;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateVerification;

    @Enumerated(EnumType.STRING)
    private StatutPresence statutPresence;

    private String commentaire;

    @ManyToOne
    private Article article;

    @ManyToOne
    private Utilisateur agent;

    @ManyToOne
    private CampagneInventaire campagne;

}