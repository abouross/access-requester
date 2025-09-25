package td.aboudev.access_requester.models.forms;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginForm {
    @NotBlank
    @Size(min = 2, max = 200)
    private String username;
    @NotBlank
    @Size(min = 2, max = 100)
    private String password;
}
