package td.aboudev.access_requester.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import td.aboudev.access_requester.entities.AccessRequest;

import java.util.Date;
import java.util.List;

public class AccessRequestDto {
    @Getter
    @AllArgsConstructor
    public static class Base {
        protected final Long id;
        protected final UserDto.List initiator;
        protected final Date createdAt;
        protected final AccessRequest.AccessRequestStatus status;
    }

    public static class List extends Base {

        public List(Long id, UserDto.List initiator, Date createdAt, AccessRequest.AccessRequestStatus status) {
            super(id, initiator, createdAt, status);
        }

        public static List newInstance(AccessRequest accessRequest) {
            return new List(
                    accessRequest.getId(),
                    UserDto.List.newInstance(accessRequest.getInitiator()),
                    accessRequest.getCreatedAt(),
                    accessRequest.getStatus()
            );
        }
    }
}
