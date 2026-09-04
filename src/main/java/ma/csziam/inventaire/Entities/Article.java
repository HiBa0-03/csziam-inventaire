package ma.csziam.inventaire.Entities;

import jakarta.persistence.*;
import lombok.*;
import ma.csziam.inventaire.Enums.EtatArticle;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String designation;

    private String numeroInventaire;

    private EtatArticle etat;

    private LocalDate dateAcquisition;

    private Double valeur;

    @ManyToOne
    private Categorie categorie;

    @ManyToOne
    private Laboratoire laboratoire;

    @ManyToOne
    private ServiceOrganisationnel service;
}