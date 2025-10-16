package td.aboudev.access_requester.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class FlowValidator extends BaseValidator {
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private ValidationFlow flow;

    public FlowValidator(User validator, Integer position, ValidationFlow flow) {
        super(validator, position);
        this.flow = flow;
    }
}
