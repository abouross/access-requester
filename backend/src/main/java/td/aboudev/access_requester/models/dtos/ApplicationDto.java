package td.aboudev.access_requester.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import td.aboudev.access_requester.entities.Application;

public class ApplicationDto {
    @Getter
    @AllArgsConstructor
    public static class Base {
        protected final Long id;
        protected final String name;
        protected final Boolean enabled;
    }

    public static class List extends Base {
        public List(Long id, String name, Boolean enabled) {
            super(id, name, enabled);
        }

        public static List newInstance(Application application) {
            return new List(application.getId(), application.getName(), application.getEnabled());
        }
    }

    @Getter
    public static class Details extends Base {
        private final String description;
        private final ValidationContextDto.List context;
        private final java.util.List<String> roles;

        public Details(Long id, String name, Boolean enabled, String description, ValidationContextDto.List context, java.util.List<String> roles) {
            super(id, name, enabled);
            this.description = description;
            this.context = context;
            this.roles = roles;
        }

        public static Details newInstance(Application application) {
            return new Details(
                    application.getId(),
                    application.getName(),
                    application.getEnabled(),
                    application.getDescription(),
                    ValidationContextDto.List.newInstance(application.getContext()),
                    application.getRoles()
            );
        }
    }
}
