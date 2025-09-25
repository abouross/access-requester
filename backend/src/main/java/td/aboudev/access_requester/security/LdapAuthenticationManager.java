package td.aboudev.access_requester.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.query.SearchScope;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import td.aboudev.access_requester.entities.User;
import td.aboudev.access_requester.exceptions.BadRequestException;
import td.aboudev.access_requester.services.TranslationService;
import td.aboudev.access_requester.services.UserService;

import static org.springframework.ldap.query.LdapQueryBuilder.query;

@Component
@RequiredArgsConstructor
@Slf4j
public class LdapAuthenticationManager implements AuthenticationManager {
    private final LdapTemplate ldapTemplate;
    private final UserService userService;
    private final TranslationService translate;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        Assert.isInstanceOf(UsernamePasswordAuthenticationToken.class, authentication,
                "Can only process UsernamePasswordAuthenticationToken objects");
        String username = authentication.getName();
        String password = (String) authentication.getCredentials();
        if (!StringUtils.hasLength(password)) {
            log.debug("Failed to authenticate since no credentials provided");
            throw new BadCredentialsException(translate.trans("authenticate.empty-password"));
        }
        try {
            ldapTemplate.authenticate(
                    query()
                            .searchScope(SearchScope.SUBTREE)
                            .where("sAMAccountName")
                            .is(username)
                            .or(query().where("mail").is(username)),
                    password
            );
            User user = userService.getOrCreateByUsername(username);
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    username,
                    password,
                    user.getRoles()
                            .stream()
                            .map(SimpleGrantedAuthority::new)
                            .toList()
            );
            SecurityContextHolder
                    .getContext()
                    .setAuthentication(auth);
            return auth;
        } catch (org.springframework.ldap.AuthenticationException | EmptyResultDataAccessException e) {
            log.warn("Failed to authenticate: {}", e.getMessage(), e);
            throw new BadCredentialsException(translate.trans("authenticate.failed"));
        } catch (Exception e) {
            log.warn("Authentication exception: {}", e.getMessage(), e);
            throw new BadRequestException(translate.trans("authenticate.exception"));
        }
    }
}
