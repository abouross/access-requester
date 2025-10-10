package td.aboudev.access_requester.models.forms;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ValidatorForm {
    @NotNull
    private Long validator;
    @NotNull
    @Min(1)
    private Integer position;
}
