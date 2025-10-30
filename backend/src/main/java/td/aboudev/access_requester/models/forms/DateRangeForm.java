package td.aboudev.access_requester.models.forms;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import td.aboudev.access_requester.validations.contraints.DateRange;

import java.time.LocalDate;

@Getter
@Setter
@DateRange
public class DateRangeForm {
    @NotNull
    protected LocalDate startDate;
    @NotNull
    protected LocalDate endDate;
}
