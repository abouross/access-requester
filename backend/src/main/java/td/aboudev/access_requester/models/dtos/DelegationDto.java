package td.aboudev.access_requester.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import td.aboudev.access_requester.entities.Delegation;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class DelegationDto {
    private final long id;
    private final UserDto.List delegatedUser;
    private final LocalDate startDate;
    private final LocalDate endDate;

    public static DelegationDto newInstance(Delegation delegation) {
        return new DelegationDto(
                delegation.getId(),
                UserDto.List.newInstance(delegation.getDelegatedUser()),
                delegation.getStartDate(),
                delegation.getEndDate()
        );
    }
}
