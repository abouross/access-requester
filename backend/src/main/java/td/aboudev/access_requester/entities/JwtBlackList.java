package td.aboudev.access_requester.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtBlackList {
    @Id
    @Column(unique = true, nullable = false, length = 500)
    private String token;
    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date expirationDate;
}
