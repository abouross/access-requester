package td.aboudev.access_requester.models.dtos;

public record ValidationErrorDto(String field, String message, Object rejectedValue) {
}
