package td.aboudev.access_requester.models.forms;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicationForm {
    @NotBlank
    private String name;
    @NotNull
    private Integer validationContext;
    @Size(min = 5)
    private String description;
    @NotNull
    private Boolean enabled;
}
