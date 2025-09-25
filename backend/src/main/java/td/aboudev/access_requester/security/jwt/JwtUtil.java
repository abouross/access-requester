package td.aboudev.access_requester.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import td.aboudev.access_requester.entities.JwtBlackList;
import td.aboudev.access_requester.repositories.JwtBlackListRepository;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtUtil {
    private final JwtBlackListRepository jwtBlackListRepository;
    @Value("${jwt.secret}")
    private String jwtSecret;
    @Value("${jwt.expiration}")
    private int jwtExpirationMs;
    private SecretKey key;

    /**
     * Initializes the key after the class is instantiated and the jwtSecret is injected,
     * preventing the repeated creation of the key and enhancing performance
     */
    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generate JWT token builder from username. Why Jwt builder instead of finished token, to give more flexibility
     * when we want to add more claims like roles.
     *
     * @param username username for authenticated user
     * @return Jwt builder
     */
    public JwtBuilder generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS256);
    }

    /**
     * Get username from JWT token
     *
     * @param token string token to be parsed
     * @return a username from given token
     */
    public String getUsernameFromToken(String token) {
        return parseJwtToken(token)
                .getSubject();
    }

    /**
     * Parse a string jwt token
     *
     * @param token The string jwt token
     * @return Claims contained in the token
     */
    public Claims parseJwtToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key).build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Validate JWT token
     *
     * @param token The string jwt token
     * @return True if given token is valid, false when not
     */
    public boolean validateJwtToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            // Check if jwt is blacklisted
            return !jwtBlackListRepository.existsByToken(token);
        } catch (SecurityException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    /**
     * Extract jwt string token from request
     *
     * @param request Current http request
     * @return The extracted token, null when not found
     */
    public String getJwtTokenFromRequest(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }

    /**
     * Add disconnected user token to blacklist when user logout before expiration
     *
     * @param token          User jwt
     * @param expirationDate Jwt expiration date
     */
    public void addToBlacklist(String token, Date expirationDate) {
        try {
            JwtBlackList jwtBlackList = JwtBlackList.builder()
                    .token(token)
                    .expirationDate(expirationDate)
                    .build();
            jwtBlackListRepository.save(jwtBlackList);
        } catch (Exception e) {
            log.warn("Unable to blacklist jwt {}: {}", token, e.getMessage());
        }
    }
}
