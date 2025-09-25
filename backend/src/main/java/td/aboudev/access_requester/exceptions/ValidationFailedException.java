package td.aboudev.access_requester.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import td.aboudev.access_requester.models.dtos.ValidationErrorDto;

import java.util.HashSet;
import java.util.Set;

@ResponseStatus(HttpStatus.BAD_REQUEST)
@Getter
public class ValidationFailedException extends RuntimeException {
    private final Set<ValidationErrorDto> validationErrors;

    public ValidationFailedException(Set<ValidationErrorDto> validationErrors) {
        this.validationErrors = validationErrors;
    }

    public ValidationFailedException(ValidationErrorDto validationError) {
        validationErrors = new HashSet<>();
        validationErrors.add(validationError);
    }
}
