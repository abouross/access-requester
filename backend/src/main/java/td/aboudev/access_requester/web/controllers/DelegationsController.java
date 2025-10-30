package td.aboudev.access_requester.web.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import td.aboudev.access_requester.models.PageModel;
import td.aboudev.access_requester.models.dtos.UserDelegationsDto;
import td.aboudev.access_requester.models.dtos.UserDto;
import td.aboudev.access_requester.models.forms.DelegationForm;
import td.aboudev.access_requester.services.DelegationService;
import td.aboudev.access_requester.services.UserService;

@RestController
@RequestMapping("/api/delegations")
@RequiredArgsConstructor
public class DelegationsController {
    private final DelegationService delegationService;
    private final UserService userService;

    @GetMapping
    public PageModel<UserDto.List> list(@RequestParam(required = false) String search, Pageable pageable) {
        return delegationService.list(search, pageable);
    }

    @GetMapping("/user/{userId}")
    public UserDelegationsDto getUserDelegation(@PathVariable Long userId) {
        return delegationService.getUserDelegation(userId);
    }

    @PostMapping("/user/{userId}")
    public UserDelegationsDto create(@RequestBody @Valid DelegationForm form, @PathVariable Long userId) {
        return delegationService.create(userId, form);
    }

    @GetMapping("/users")
    public PageModel<UserDto.List> usersList(@RequestParam(required = false) String search, Pageable pageable) {
        return userService.activeList(search, pageable);
    }

    @DeleteMapping("/{id}")
    public void delete( @PathVariable Long id) {
         delegationService.delete(id);
    }
}
