package td.aboudev.access_requester.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.filter.AndFilter;
import org.springframework.ldap.filter.EqualsFilter;
import org.springframework.ldap.filter.OrFilter;
import org.springframework.ldap.filter.PresentFilter;
import org.springframework.stereotype.Service;
import td.aboudev.access_requester.entities.User;
import td.aboudev.access_requester.repositories.UserRepository;

import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import java.util.List;
import java.util.Objects;

import static org.springframework.ldap.query.LdapQueryBuilder.query;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    public static final String DISABLED_USER_NUMBER = "514";

    private final UserRepository userRepository;
    private final LdapTemplate ldapTemplate;

    /**
     * Try to find user in db if not the retrieve it from LDAP server and then persist it
     *
     * @param username username or email to looking for user
     * @return Found user or null if not
     */
    public User getOrCreateByUsername(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            log.info("User not found with username '{}' in local, looking for in ldap... ", username);
            AndFilter andFilter = new AndFilter();
            andFilter.and(new EqualsFilter("objectclass", "person"));
            andFilter.and(new PresentFilter("sAMAccountName"));
            andFilter.and(new PresentFilter("mail"));
            OrFilter orFilter = new OrFilter();
            orFilter.or(new EqualsFilter("sAMAccountName", username));
            orFilter.or(new EqualsFilter("mail", username));
            andFilter.and(orFilter);
            String encodedFilter = andFilter.encode();
            log.trace("Search filter '{}'", encodedFilter);
            List<User> foundUsers = ldapTemplate.search(
                    query().filter(andFilter),
                    (AttributesMapper<User>) attributes -> User.builder()
                            .username(getStringValue("sAMAccountName", attributes))
                            .email(getStringValue("mail", attributes))
                            .firstName(getStringValue("givenName", attributes))
                            .lastName(getStringValue("sn", attributes))
                            .title(getStringValue("title", attributes))
                            .department(getStringValue("department", attributes))
                            .enabled(!Objects.equals(
                                    getStringValue("userAccountControl", attributes),
                                    DISABLED_USER_NUMBER
                            ))
                            .build()
            );
            if (foundUsers.isEmpty()) {
                return null;
            }
            if (foundUsers.size() > 1) {
                // Handle the case where multiple entries match the 'unique' filter
                throw new IllegalStateException("Multiple users found for username: " + username);
            }
            user = foundUsers.get(0);
            // Save user
            userRepository.save(user);
        }
        return user;
    }

    /**
     * Get string value from attribute
     *
     * @param attributeName the attribute name to get
     * @param attributes    Ldap result attributes
     * @return a string attribute value
     */
    private String getStringValue(String attributeName, Attributes attributes) {
        try {
            Attribute attribute = attributes.get(attributeName);
            if (attribute != null) {
                Object value = attribute.get();
                if (value != null)
                    return (String) value;
            }
        } catch (NamingException ignored) {
        }
        return null;
    }

}
