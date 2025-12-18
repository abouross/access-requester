package td.aboudev.access_requester.web.controllers;

import jakarta.servlet.ServletConfig;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import td.aboudev.access_requester.models.PageModel;
import td.aboudev.access_requester.models.dtos.AccessRequestDto;
import td.aboudev.access_requester.models.forms.AccessRequestForm;
import td.aboudev.access_requester.services.AccessRequestService;

@RestController
@RequestMapping("/api/access-requests")
@RequiredArgsConstructor
public class AccessRequestsController {
    private final AccessRequestService accessRequestService;
    private final ServletConfig servletConfig;

    @GetMapping
    public PageModel<AccessRequestDto.List> list(@RequestParam(required = false) String search, Pageable pageable) {
        return accessRequestService.list(search, pageable);
    }

    @PostMapping
    public AccessRequestDto.List create(@RequestBody @Valid AccessRequestForm form) {
        return accessRequestService.create(form);
    }
}
