package td.aboudev.access_requester.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidationFlow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false)
    private User user;
    @ManyToOne(optional = false)
    private ValidationContext context;
    @OneToMany(mappedBy = "flow", cascade = {CascadeType.PERSIST, CascadeType.REMOVE}, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("position asc")
    private List<FlowValidator> validators;
}
