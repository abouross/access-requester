package td.aboudev.access_requester.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccessRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private User initiator;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date createdAt;

    @ManyToOne(optional = false)
    private User createdBy;

    @Column(nullable = false)
    private AccessRequestStatus status;


    public enum AccessRequestStatus {
        NEW_REQUEST,
        PENDING,
        APPROVED,
        REJECTED,
        EXPIRED
    }
}
