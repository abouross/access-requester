package td.aboudev.access_requester.web.controllers;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import td.aboudev.access_requester.models.PageModel;
import td.aboudev.access_requester.models.dtos.ApplicationDto;
import td.aboudev.access_requester.models.dtos.ValidationContextDto;
import td.aboudev.access_requester.models.forms.ApplicationForm;
import td.aboudev.access_requester.services.ApplicationService;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ADMIN', 'APP_MNGT')")
public class ApplicationsController {
    private final ApplicationService applicationService;

    @GetMapping
    public PageModel<ApplicationDto.List> list(@RequestParam(required = false) String search, Pageable pageable) {
        return applicationService.list(search, pageable);
    }

    @GetMapping("/contexts")
    public List<ValidationContextDto.List> activesContexts() {
        return applicationService.activesContexts();
    }

    @PostMapping
    public ApplicationDto.List create(@RequestBody @Valid ApplicationForm form) {
        return applicationService.create(form);
    }

    @GetMapping("/{id}")
    public ApplicationDto.Details get(@PathVariable Long id) {
        return applicationService.get(id);
    }

    @PutMapping("/{id}")
    public ApplicationDto.Details update(@PathVariable Long id, @RequestBody @Valid ApplicationForm form) {
        return applicationService.update(id, form);
    }

    @PostMapping("/{id}/roles")
    public void addRole(@PathVariable Long id, @RequestBody @Valid @NotBlank @Size(min = 2, max = 100) String role) {
        applicationService.addRole(id, role);
    }

    @DeleteMapping("/{id}/roles/{role}")
    public void removeRole(@PathVariable Long id, @PathVariable String role) {
        applicationService.removeRole(id, role);
    }
}
