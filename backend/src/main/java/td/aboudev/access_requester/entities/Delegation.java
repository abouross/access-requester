package td.aboudev.access_requester.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Delegation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @ManyToOne(optional = false)
    private User user;
    @ManyToOne(optional = false)
    private User delegatedUser;
    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private LocalDate startDate;
    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private LocalDate endDate;
}
