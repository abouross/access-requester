package td.aboudev.access_requester.models.dtos;

import lombok.Getter;
import td.aboudev.access_requester.entities.User;

@Getter
public class ValidatorDto {
    private final Long id;
    private final UserDto.List validator;
    private final Integer position;

    public ValidatorDto(Long id, User validator, Integer position) {
        this.id = id;
        this.validator = UserDto.List.newInstance(validator);
        this.position = position;
    }
}
