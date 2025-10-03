package td.aboudev.access_requester.models.forms;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UpdateUserForm {
    @NotBlank
    @Size(min = 2, max = 100)
    protected String email;
    protected String firstName;
    protected String lastName;
    @NotBlank
    @Size(min = 6, max = 200)
    protected String password;
    protected List<String> roles;
    @NotNull
    protected Boolean enabled;
    protected String title;
    protected String department;
}
