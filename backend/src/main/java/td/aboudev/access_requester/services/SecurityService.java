package td.aboudev.access_requester.services;

import io.jsonwebtoken.JwtBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import td.aboudev.access_requester.entities.User;
import td.aboudev.access_requester.exceptions.UnauthorizedException;
import td.aboudev.access_requester.models.dtos.LoginResultDto;
import td.aboudev.access_requester.models.dtos.ProfileDto;
import td.aboudev.access_requester.repositories.UserRepository;
import td.aboudev.access_requester.security.jwt.JwtUtil;

@Service
@RequiredArgsConstructor
@Slf4j
public class SecurityService {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtils;
    private final UserRepository userRepository;

    /**
     * Authentication of an user
     *
     * @param username username or mail
     * @param password user password
     * @return login result
     */
    public LoginResultDto login(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        username,
                        password
                )
        );
        JwtBuilder builder = jwtUtils.generateToken(authentication.getName());
        User user = userRepository.findByUsername(authentication.getName());
        builder.claim("roles", user.getRoles());
        return new LoginResultDto(builder.compact());
    }

    /**
     * Get current user profile
     *
     * @return user profile information
     */
    public ProfileDto getUserProfile() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername());
        if (user == null) {
            throw new UnauthorizedException();
        }
        return new ProfileDto(
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                !user.getFirstName().isEmpty() || !user.getLastName().isEmpty() ?
                        user.getFirstName().concat(" ").concat(user.getLastName()) :
                        user.getUsername()
        );
    }
}
