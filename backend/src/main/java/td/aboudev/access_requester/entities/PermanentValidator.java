package td.aboudev.access_requester.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class PermanentValidator extends BaseValidator {
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private ValidationContext context;

    public PermanentValidator(User validator, Integer position, ValidationContext context) {
        super(validator, position);
        this.context = context;
    }

    public PermanentValidator() {
        super();
    }
}
