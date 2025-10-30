package td.aboudev.access_requester.services;

import io.jsonwebtoken.JwtBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import td.aboudev.access_requester.configs.properties.RolesMapProperties;
import td.aboudev.access_requester.entities.User;
import td.aboudev.access_requester.exceptions.BadRequestException;
import td.aboudev.access_requester.exceptions.UnauthorizedException;
import td.aboudev.access_requester.models.dtos.LoginResultDto;
import td.aboudev.access_requester.models.dtos.ProfileDto;
import td.aboudev.access_requester.models.dtos.UserDto;
import td.aboudev.access_requester.models.forms.ChangePasswordForm;
import td.aboudev.access_requester.models.forms.ProfileForm;
import td.aboudev.access_requester.repositories.UserRepository;
import td.aboudev.access_requester.security.jwt.JwtUtil;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SecurityService {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtils;
    private final UserRepository userRepository;
    private final RolesMapProperties rolesMapProperties;
    private final TranslationService translate;
    private final PasswordEncoder passwordEncoder;

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
        User user = getCurrentUser();
        return new ProfileDto(
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.display(),
                user.getTitle(),
                user.getEmail()
        );
    }

    /**
     * Get current user details
     *
     * @return User details
     */
    public UserDto.Details getUserProfileDetails() {
        User user = getCurrentUser();
        Map<String, String> rolesMap = rolesMapProperties.getMap();
        user.getRoles().replaceAll(key -> translate.trans(rolesMap.get(key)));
        return UserDto.Details.newInstance(user);
    }

    /**
     * Get current user
     *
     * @return User entity
     */
    public User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername());
        if (user == null) {
            throw new UnauthorizedException();
        }
        return user;
    }

    /**
     * Update profile information
     *
     * @param form Profile form
     * @return Updated profile
     */
    public UserDto.Details updateUserProfileDetails(ProfileForm form) {
        User user = getCurrentUser();

        user.setFirstName(form.getFirstName());
        user.setLastName(form.getLastName());
        user.setEmail(form.getEmail());
        user.setUsername(form.getUsername());

        userRepository.save(user);

        Map<String, String> rolesMap = rolesMapProperties.getMap();
        user.getRoles().replaceAll(key -> translate.trans(rolesMap.get(key)));
        return UserDto.Details.newInstance(user);
    }

    public void changePassword(ChangePasswordForm form) {
        User user = getCurrentUser();
        if (!passwordEncoder.matches(form.getOldPassword(), user.getPassword()))
            throw new BadRequestException(translate.trans("password.incorrect"));
        if (passwordEncoder.matches(form.getNewPassword(), user.getPassword()))
            throw new BadRequestException(translate.trans("password.same_password"));
        user.setPassword(passwordEncoder.encode(form.getNewPassword()));
        userRepository.save(user);
    }
}
