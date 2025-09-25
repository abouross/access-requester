package td.aboudev.access_requester.web.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;
import td.aboudev.access_requester.exceptions.BadRequestException;
import td.aboudev.access_requester.models.dtos.LoginResultDto;
import td.aboudev.access_requester.models.dtos.ProfileDto;
import td.aboudev.access_requester.models.forms.LoginForm;
import td.aboudev.access_requester.services.SecurityService;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SecurityController {
    private final SecurityService security;

    @PostMapping("/login")
    public LoginResultDto login(@RequestBody @Valid LoginForm form) {
        try {
            return security.login(form.getUsername(), form.getPassword());
        } catch (BadCredentialsException e) {
            throw new BadRequestException(e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ProfileDto profile() {
        return security.getUserProfile();
    }
}
