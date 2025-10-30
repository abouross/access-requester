package td.aboudev.access_requester.models.forms;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DelegationForm extends DateRangeForm {
    @NotNull
    private Long delegatedUserId;
}
