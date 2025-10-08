package td.aboudev.access_requester.models.forms;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordForm {
    @NotBlank
    @Size(min = 6, max = 200)
    private String oldPassword;

    @NotBlank
    @Size(min = 6, max = 200)
    private String newPassword;
}
