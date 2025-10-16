package td.aboudev.access_requester.models.forms;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ValidationFlowForm {
    @NotNull
    private Long user;
    @NotNull
    private Integer context;
}
