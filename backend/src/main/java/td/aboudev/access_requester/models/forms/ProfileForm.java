package td.aboudev.access_requester.models.forms;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileForm {
    @Size(min = 2, max = 200)
    private String firstName;
    @Size(min = 2, max = 200)
    private String lastName;
    @NotBlank
    @Size(min = 2, max = 100)
    @Email
    private String email;
    @NotBlank
    @Size(min = 2, max = 100)
    private String username;
}
