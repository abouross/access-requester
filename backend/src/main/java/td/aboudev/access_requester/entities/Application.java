package td.aboudev.access_requester.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Collections;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    private String description;
    @Column(nullable = false)
    private Boolean enabled;

    @ManyToOne
    @JoinColumn(name = "validation_context_id")
    private ValidationContext context;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "application_roles")
    private List<String> roles = Collections.emptyList();
}
