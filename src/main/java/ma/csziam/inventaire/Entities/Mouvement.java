package ma.csziam.inventaire.Entities;
import jakarta.persistence.*;
import lombok.*;
import ma.csziam.inventaire.Enums.TypeMouvement;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mouvement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private TypeMouvement typeMouvement;

    private String motif;

    private String ancienneLocalisation;

    private String nouvelleLocalisation;

    @ManyToOne
    private Article article;

    @ManyToOne
    private Utilisateur utilisateur;
}