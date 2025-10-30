package td.aboudev.access_requester.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import td.aboudev.access_requester.entities.User;

import java.util.List;

@Getter
@AllArgsConstructor
public class UserDelegationsDto {
    private final Long id;
    private final String username;
    private final String email;
    private final String firstName;
    private final String lastName;
    private final String title;
    private final String department;
    private final List<DelegationDto> delegations;

    public static UserDelegationsDto newInstance(User user) {
        return new UserDelegationsDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(), user.getTitle(), user.getDepartment(),
                user.getDelegations()
                        .stream()
                        .map(DelegationDto::newInstance)
                        .toList()
        );
    }
}
