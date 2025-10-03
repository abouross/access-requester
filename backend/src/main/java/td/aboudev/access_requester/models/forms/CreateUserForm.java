package td.aboudev.access_requester.models.forms;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateUserForm {
    @NotBlank
    @Size(min = 2, max = 100)
    private String username;
    @NotBlank
    @Size(min = 2, max = 100)
    private String email;
    private String firstName;
    private String lastName;
    @NotBlank
    @Size(min = 6, max = 200)
    private String password;
    private List<String> roles;
    @NotNull
    private Boolean enabled;
    private String title;
    private String department;
}
