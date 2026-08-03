package ma.csziam.inventaire.Security;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import ma.csziam.inventaire.Entities.Utilisateur;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET =
            "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz123456";

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }
        public String generateToken(Utilisateur utilisateur) {

            return Jwts.builder()
                    .setSubject(utilisateur.getEmail())
                    .claim("role", utilisateur.getRoleUtilisateur().name())
                    .setIssuedAt(new Date())
                    .setExpiration(
                            new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)
                    )
                    .signWith(getKey(), SignatureAlgorithm.HS256)
                    .compact();
        }
    public String extractUsername(String token) {

        Claims claims = Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    public boolean isTokenValid(String token, String email) {

        return extractUsername(token).equals(email);
    }

}