package td.aboudev.access_requester.models.forms;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ValidationContextForm {
    @NotBlank
    private String name;
    @NotNull
    private Boolean enabled;
    private String description;
}
