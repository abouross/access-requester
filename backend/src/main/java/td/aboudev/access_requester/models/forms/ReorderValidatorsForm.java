package td.aboudev.access_requester.models.forms;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReorderValidatorsForm {
    @NotNull
    @NotEmpty
    List<@Valid ValidatorForm> validators;
}
