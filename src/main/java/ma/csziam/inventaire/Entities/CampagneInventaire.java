package ma.csziam.inventaire.Entities;
import jakarta.persistence.*;
import lombok.*;
import ma.csziam.inventaire.Enums.StatutInventaire;
import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampagneInventaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int annee;

    private LocalDate dateDebut;

    private LocalDate dateFin;

    @Enumerated(EnumType.STRING)
    private StatutInventaire statut;

    @OneToMany(mappedBy = "campagne")
    private List<Inventaire> inventaires;


}