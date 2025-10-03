package td.aboudev.access_requester.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserCountsDto {
    private Long enabled;
    private Long disabled;
    private Long total;
}
