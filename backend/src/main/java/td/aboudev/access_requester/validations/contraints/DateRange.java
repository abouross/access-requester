package td.aboudev.access_requester.validations.contraints;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import td.aboudev.access_requester.validations.DateRangeValidator;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = DateRangeValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface DateRange {
    String message() default "{date.range.constraint.message}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
