package td.aboudev.access_requester.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResultDto {
    private final String token;
}
