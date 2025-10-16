package td.aboudev.access_requester.models.dtos;

import lombok.Getter;
import td.aboudev.access_requester.entities.FlowValidator;
import td.aboudev.access_requester.entities.User;
import td.aboudev.access_requester.entities.ValidationContext;
import td.aboudev.access_requester.entities.ValidationFlow;

public class ValidationFlowDto {
    @Getter
    public static class List {
        protected Long id;
        protected UserDto.List user;
        protected ValidationContextDto.List context;

        public List(Long id, User user, ValidationContext context) {
            this.id = id;
            this.user = UserDto.List.newInstance(user);
            this.context = new ValidationContextDto.List(context.getId(), context.getName(), context.getEnabled());
        }

        public static List getInstance(ValidationFlow validationFlow) {
            return new List(validationFlow.getId(), validationFlow.getUser(), validationFlow.getContext());
        }
    }

    @Getter
    public static class Detail extends List {
        private final java.util.List<ValidatorDto> validators;

        public Detail(Long id, User user, ValidationContext context, java.util.List<FlowValidator> validators) {
            super(id, user, context);
            this.validators = validators.stream()
                    .map(v -> new ValidatorDto(v.getId(), v.getValidator(), v.getPosition()))
                    .toList();
        }

        public static Detail getInstance(ValidationFlow validationFlow) {
            return new Detail(validationFlow.getId(), validationFlow.getUser(), validationFlow.getContext(), validationFlow.getValidators());
        }
    }
}
