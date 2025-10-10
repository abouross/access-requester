package td.aboudev.access_requester.web.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import td.aboudev.access_requester.models.PageModel;
import td.aboudev.access_requester.models.dtos.ValidationContextDto;
import td.aboudev.access_requester.models.dtos.ValidatorDto;
import td.aboudev.access_requester.models.forms.ReorderValidatorsForm;
import td.aboudev.access_requester.models.forms.ValidationContextForm;
import td.aboudev.access_requester.models.forms.ValidatorForm;
import td.aboudev.access_requester.services.ValidationContextService;

import java.util.List;

@RestController
@RequestMapping("/api/validation-contexts")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ADMIN', 'SETTINGS')")
public class ValidationContextController {
    private final ValidationContextService contextService;

    @GetMapping
    public PageModel<ValidationContextDto.List> list(Pageable pageable) {
        return contextService.list(pageable);
    }

    @GetMapping("/actives")
    public List<ValidationContextDto.List> listActive() {
        return contextService.listActive();
    }

    @GetMapping("/{id}")
    public ValidationContextDto.Detail get(@PathVariable Integer id) {
        return contextService.get(id);
    }

    @PostMapping
    public ValidationContextDto.Detail create(@RequestBody @Valid ValidationContextForm form) {
        return contextService.create(form);
    }

    @PutMapping("/{id}")
    public ValidationContextDto.Detail update(@PathVariable Integer id, @RequestBody @Valid ValidationContextForm form) {
        return contextService.update(id, form);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        contextService.delete(id);
    }

    @PostMapping("/{id}/add-validator")
    public ValidatorDto addValidator(@PathVariable Integer id, @RequestBody @Valid ValidatorForm form) {
        return contextService.addValidator(id, form);
    }

    @DeleteMapping("/{id}/delete-validator/{vId}")
    public List<ValidatorDto> deleteValidator(@PathVariable Integer id, @PathVariable Long vId) {
        return contextService.deleteValidator(id, vId);
    }

    @PutMapping("/{id}/reorder-validators")
    public List<ValidatorDto> reorderValidators(@PathVariable Integer id, @RequestBody @Valid ReorderValidatorsForm form) {
        return contextService.reorderValidators(id, form);
    }
}
