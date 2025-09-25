package td.aboudev.access_requester.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Collections;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 200, nullable = false, unique = true)
    private String username;
    @Column(length = 200, nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private Boolean enabled;
    private String firstName;
    private String lastName;
    private String title;
    private String department;
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles")
    @Getter(AccessLevel.NONE)
    private List<String> roles = Collections.emptyList();

    public List<String> getRoles() {
        if (roles == null) {
            return Collections.emptyList();
        }
        return roles;
    }

    public String display() {
        if (firstName == null && lastName == null) {
            return username;
        }
        return firstName + " " + lastName;
    }
}
