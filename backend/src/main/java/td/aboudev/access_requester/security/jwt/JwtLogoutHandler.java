package td.aboudev.access_requester.security.jwt;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Date;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtLogoutHandler  implements LogoutHandler, LogoutSuccessHandler {
    private final JwtUtil jwtUtil;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        String token = jwtUtil.getJwtTokenFromRequest(request);
        if (token != null) {
            try {
                Date expirationDate = jwtUtil.parseJwtToken(token)
                        .getExpiration();
                // If token not expired, no need to blacklist an expired token
                log.debug("Jwt expiration date {} , now {}", expirationDate, new Date());
                if (new Date().before(expirationDate)) {
                    // Add the JWT to blacklist list
                    jwtUtil.addToBlacklist(token, expirationDate);
                } else
                    log.debug("Expired JWT Token: {}", token);
            } catch (Exception e) {
                log.warn("Invalid JWT Token {}: {}", token, e.getLocalizedMessage());
            }
        } else
            log.debug("JWT Token is null");
    }

    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
    }
}
