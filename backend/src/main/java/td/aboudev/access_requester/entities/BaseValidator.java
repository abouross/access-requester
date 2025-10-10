package td.aboudev.access_requester.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@MappedSuperclass()
@Getter
@Setter
@NoArgsConstructor
public class BaseValidator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;
    @ManyToOne(optional = false)
    protected User validator;
    @Column(nullable = false)
    protected Integer position;

    public BaseValidator(User validator, Integer position) {
        this.validator = validator;
        this.position = position;
    }
}
