package td.aboudev.access_requester.validations;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import td.aboudev.access_requester.models.forms.DateRangeForm;
import td.aboudev.access_requester.validations.contraints.DateRange;

public class DateRangeValidator implements ConstraintValidator<DateRange, DateRangeForm> {
    @Override
    public boolean isValid(DateRangeForm value, ConstraintValidatorContext context) {
        if (value.getStartDate() == null || value.getEndDate() == null) {
            return true; // @NotNull handles null checks separately
        }
        if (value.getEndDate().isBefore(value.getStartDate())) {
            context.disableDefaultConstraintViolation(); // Disable default message
            context.buildConstraintViolationWithTemplate(context.getDefaultConstraintMessageTemplate())
                    .addPropertyNode("startDate") // Associate message with a specific field
                    .addConstraintViolation();
            return false;
        }
        return true;
    }
}
