package td.aboudev.access_requester.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import td.aboudev.access_requester.entities.PermanentValidator;
import td.aboudev.access_requester.entities.ValidationContext;

import java.util.ArrayList;

public class ValidationContextDto {
    @Getter
    @AllArgsConstructor
    public static class List {
        protected final Integer id;
        protected final String name;
        protected final Boolean enabled;

        public static List newInstance(ValidationContext context) {
            return new List(
                    context.getId(),
                    context.getName(),
                    context.getEnabled()
            );
        }
    }

    @Getter
    public static class Detail extends List {
        private final String description;
        private final java.util.List<ValidatorDto> validators;

        public Detail(Integer id, String name, Boolean enabled, String description, java.util.List<PermanentValidator> validators) {
            super(id, name, enabled);
            this.description = description;
            if (validators != null)
                this.validators = validators
                        .stream().map(entity -> new ValidatorDto(entity.getId(), entity.getValidator(), entity.getPosition()))
                        .toList();
            else
                this.validators = new ArrayList<>();
        }

        public static Detail newInstance(ValidationContext context) {
            return new Detail(
                    context.getId(),
                    context.getName(),
                    context.getEnabled(),
                    context.getDescription(),
                    context.getValidators()
            );
        }

    }
}
