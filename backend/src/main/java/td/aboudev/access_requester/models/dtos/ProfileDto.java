package td.aboudev.access_requester.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProfileDto {
    private final String username;
    private final String firstName;
    private final String lastName;
    private final String displayName;
}
