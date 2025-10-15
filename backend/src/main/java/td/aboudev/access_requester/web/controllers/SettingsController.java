package td.aboudev.access_requester.web.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import td.aboudev.access_requester.models.PageModel;
import td.aboudev.access_requester.models.dtos.UserDto;
import td.aboudev.access_requester.services.UserService;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ADMIN', 'SETTINGS')")
public class SettingsController {
    private final UserService userService;

    @GetMapping("/users")
    public PageModel<UserDto.List> list(@RequestParam(required = false) String search, Pageable pageable) {
        return userService.activeList(search, pageable);
    }
}
