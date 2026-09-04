package ma.csziam.inventaire.Entities;
import ma.csziam.inventaire.Enums.RoleUtilisateur;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "utilisateurs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Utilisateur implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @Column(unique = true)
    private String email;

    private String motDePasse;

    @Column(unique = true)
    private String telephone;

    @Enumerated(EnumType.STRING)
    private RoleUtilisateur roleUtilisateur;

    @ManyToOne
    @JoinColumn(name = "laboratoire_id")
    private Laboratoire laboratoire;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private ServiceOrganisationnel service;



    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return List.of(
                new SimpleGrantedAuthority("ROLE_" + roleUtilisateur.name())
        );
    }
    @Override
    public String getPassword() {
        return motDePasse;
    }


    @Override
    public String getUsername() {
        return email;
    }


    @Override
    public boolean isAccountNonExpired() {
        return true;
    }


    @Override
    public boolean isAccountNonLocked() {
        return true;
    }


    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }


    @Override
    public boolean isEnabled() {
        return true;
    }

}