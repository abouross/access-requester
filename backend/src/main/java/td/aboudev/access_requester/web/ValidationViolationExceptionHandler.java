package td.aboudev.access_requester.web;

import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import td.aboudev.access_requester.exceptions.ValidationFailedException;
import td.aboudev.access_requester.models.dtos.ValidationErrorDto;
import td.aboudev.access_requester.services.TranslationService;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
@RequiredArgsConstructor
public class ValidationViolationExceptionHandler {
    private final TranslationService translate;

    @ExceptionHandler({ConstraintViolationException.class, DataIntegrityViolationException.class, MethodArgumentNotValidException.class, ValidationFailedException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Set<ValidationErrorDto> handleConstraintAndDataIntegrityViolation(Exception e) {
        if (e instanceof ConstraintViolationException cve)
            return this.handleConstraintViolation(cve);
        if (e instanceof DataIntegrityViolationException div)
            return this.handleDataIntegrityViolation(div);
        if (e instanceof MethodArgumentNotValidException mae)
            return handleMethodArgumentNotValid(mae);
        if (e instanceof ValidationFailedException bre)
            return handleBadRequestValidation(bre);
        return null;
    }

    protected Set<ValidationErrorDto> handleConstraintViolation(ConstraintViolationException e) {
        var violations = e.getConstraintViolations();
        return violations
                .stream()
                .map(violation -> new ValidationErrorDto(violation.getPropertyPath().toString(), violation.getMessage(), violation.getInvalidValue()))
                .collect(Collectors.toSet());
    }

    protected Set<ValidationErrorDto> handleDataIntegrityViolation(DataIntegrityViolationException e) {
        Set<ValidationErrorDto> errors = new HashSet<>();
        Throwable cause = e.getCause();
        while (!(cause instanceof java.sql.SQLIntegrityConstraintViolationException) && cause != null)
            cause = cause.getCause();
        if (cause != null) {
            java.sql.SQLIntegrityConstraintViolationException sqlException = (java.sql.SQLIntegrityConstraintViolationException) cause;
            // Find fields in exception message
            String[] splitMessage = sqlException
                    .getLocalizedMessage()
                    .split("\\.");
            // handle only unique constraint violation
            if (splitMessage.length > 0 && splitMessage[splitMessage.length - 1].contains("_unique")) {
                String fieldName = splitMessage[splitMessage.length - 1].replace("_unique'", "");
                errors.add(
                        new ValidationErrorDto(
                                fieldName,
                                translate.trans("validation.uniqueField.message"),
                                null
                        )
                );
            } else
                throw e;
        }
        return errors;
    }

    protected Set<ValidationErrorDto> handleMethodArgumentNotValid(MethodArgumentNotValidException e) {
        return e.getFieldErrors()
                .stream()
                .map(objectError -> new ValidationErrorDto(objectError.getField(), objectError.getDefaultMessage(), objectError.getRejectedValue()))
                .collect(Collectors.toSet());
    }

    protected Set<ValidationErrorDto> handleBadRequestValidation(ValidationFailedException e) {
        log.debug("Handling bad request exception with validation errors: {}", e.getValidationErrors());
        if (e.getValidationErrors() != null)
            return e.getValidationErrors();
        return null;
    }
}
