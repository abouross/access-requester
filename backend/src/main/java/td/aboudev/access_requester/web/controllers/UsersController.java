package td.aboudev.access_requester.web.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import td.aboudev.access_requester.configs.properties.RolesMapProperties;
import td.aboudev.access_requester.models.GroupedResult;
import td.aboudev.access_requester.models.PageModel;
import td.aboudev.access_requester.models.dtos.UserDto;
import td.aboudev.access_requester.models.forms.CreateUserForm;
import td.aboudev.access_requester.models.forms.UpdateUserForm;
import td.aboudev.access_requester.services.TranslationService;
import td.aboudev.access_requester.services.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ADMIN', 'USERS_MNGT')")
public class UsersController {
    private final UserService userService;
    private final RolesMapProperties rolesMapProperties;
    private final TranslationService translate;

    @GetMapping
    public PageModel<UserDto.List> list(@RequestParam(required = false) String search, Pageable pageable) {
        return userService.list(search, pageable);
    }

    @PostMapping
    public UserDto.List create(@Valid @RequestBody CreateUserForm form) {
        return userService.create(form);
    }

    @PutMapping("/{id}")
    public UserDto.Details update(@PathVariable Long id, @RequestBody UpdateUserForm form) {
        return userService.update(id, form);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }

    @GetMapping("/roles-map")
    public Map<String, String> getRolesMap() {
        Map<String, String> rolesMap = new HashMap<>();
        rolesMapProperties.getMap().forEach((key, value) -> rolesMap.put(key, translate.trans(value)));
        return rolesMap;
    }

    @GetMapping("/counts")
    public List<GroupedResult> counts() {
        return userService.counts();
    }

    @GetMapping("/{id}")
    public UserDto.Details get(@PathVariable Long id) {
        return userService.get(id);
    }
}
