package td.aboudev.access_requester.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ValidationContext {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private Boolean enabled;
    @Column(columnDefinition = "TEXT", length = 900)
    private String description;
    @OneToMany(mappedBy = "context", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("position asc")
    private List<PermanentValidator> validators = new ArrayList<>();
}
