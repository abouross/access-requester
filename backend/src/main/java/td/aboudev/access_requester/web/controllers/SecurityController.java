package td.aboudev.access_requester.web.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;
import td.aboudev.access_requester.exceptions.BadRequestException;
import td.aboudev.access_requester.models.dtos.LoginResultDto;
import td.aboudev.access_requester.models.dtos.ProfileDto;
import td.aboudev.access_requester.models.dtos.UserDto;
import td.aboudev.access_requester.models.forms.ChangePasswordForm;
import td.aboudev.access_requester.models.forms.LoginForm;
import td.aboudev.access_requester.models.forms.ProfileForm;
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

    @GetMapping("/profile-details")
    public UserDto.Details profileDetails() {
        return security.getUserProfileDetails();
    }

    @PutMapping("/profile-details")
    public UserDto.Details updateProfileDetails(@RequestBody @Valid ProfileForm form) {
        return security.updateUserProfileDetails(form);
    }

    @PutMapping("/change-password")
    public void changePassword(@RequestBody @Valid ChangePasswordForm form){
        security.changePassword(form);
    }
}
