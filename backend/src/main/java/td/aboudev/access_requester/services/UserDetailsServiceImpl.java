package td.aboudev.access_requester.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import td.aboudev.access_requester.entities.User;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.getOrCreateByUsername(username);
        if (user == null || !user.getEnabled()) {
            throw new UsernameNotFoundException("User not found or disabled with username: " + username);
        }
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                "", // We will use ldap authentication so no need to set password here
                user.getRoles()
                        .stream()
                        .map(SimpleGrantedAuthority::new)
                        .toList()
        );
    }
}
