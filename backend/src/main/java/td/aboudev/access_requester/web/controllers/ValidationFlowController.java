package td.aboudev.access_requester.web.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import td.aboudev.access_requester.models.PageModel;
import td.aboudev.access_requester.models.dtos.ValidationFlowDto;
import td.aboudev.access_requester.models.dtos.ValidatorDto;
import td.aboudev.access_requester.models.forms.ReorderValidatorsForm;
import td.aboudev.access_requester.models.forms.ValidationFlowForm;
import td.aboudev.access_requester.models.forms.ValidatorForm;
import td.aboudev.access_requester.services.ValidationFlowService;

import java.util.List;

@RestController
@RequestMapping("/api/validation-flows")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ADMIN', 'SETTINGS')")
public class ValidationFlowController {
    private final ValidationFlowService service;

    @GetMapping("/{contextId}/list")
    public PageModel<ValidationFlowDto.List> list(@PathVariable Integer contextId, @RequestParam(required = false) String search, Pageable pageable) {
        return service.list(pageable, contextId, search);
    }

    @PostMapping
    public ValidationFlowDto.List create(@RequestBody @Valid ValidationFlowForm form) {
        return service.create(form);
    }

    @GetMapping("/{id}")
    public ValidationFlowDto.Detail get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping("/{id}/add-validator")
    public ValidatorDto addValidator(@PathVariable Long id, @RequestBody @Valid ValidatorForm form) {
        return service.addValidator(id, form);
    }

    @DeleteMapping("/{id}/delete-validator/{vId}")
    public List<ValidatorDto> deleteValidator(@PathVariable Long id, @PathVariable Long vId) {
        return service.deleteValidator(id, vId);
    }

    @PutMapping("/{id}/reorder-validators")
    public List<ValidatorDto> reorderValidators(@PathVariable Long id, @RequestBody @Valid ReorderValidatorsForm form) {
        return service.reorderValidators(id, form);
    }
}
