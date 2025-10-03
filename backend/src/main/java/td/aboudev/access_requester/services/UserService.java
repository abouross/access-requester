package td.aboudev.access_requester.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import td.aboudev.access_requester.entities.User;
import td.aboudev.access_requester.exceptions.BadRequestException;
import td.aboudev.access_requester.models.GroupedResult;
import td.aboudev.access_requester.models.PageModel;
import td.aboudev.access_requester.models.dtos.UserDto;
import td.aboudev.access_requester.models.forms.CreateUserForm;
import td.aboudev.access_requester.models.forms.UpdateUserForm;
import td.aboudev.access_requester.repositories.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TranslationService translate;

    /**
     * List users with pagination & search
     *
     * @param search   search key
     * @param pageable pagination query sort, page size and page number
     * @return page of users list
     */
    public PageModel<UserDto.List> list(String search, Pageable pageable) {
        if (search == null || search.trim().isEmpty()) {
            return new PageModel<>(
                    userRepository.findAll(pageable)
                            .map(UserDto.List::newInstance)
            );
        }
        User user = new User();
        user.setFirstName(search);
        user.setLastName(search);
        user.setUsername(search);
        user.setEmail(search);

        ExampleMatcher matcher = ExampleMatcher.matchingAny()
                .withIgnoreCase()
                .withIgnoreNullValues()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING);
        Example<User> example = Example.of(user, matcher);
        return new PageModel<>(
                userRepository.findAll(example, pageable)
                        .map(UserDto.List::newInstance)
        );
    }

    /**
     * Create new user
     *
     * @param from user form
     * @return created user
     */
    public UserDto.List create(CreateUserForm from) {
        User user = User.builder()
                .username(from.getUsername())
                .email(from.getEmail())
                .password(passwordEncoder.encode(from.getPassword()))
                .enabled(from.getEnabled())
                .firstName(from.getFirstName())
                .lastName(from.getLastName())
                .title(from.getTitle())
                .department(from.getDepartment())
                .roles(from.getRoles())
                .build();
        userRepository.save(user);
        return UserDto.List.newInstance(user);
    }

    /**
     * Update user
     *
     * @param id   user id
     * @param form user form
     * @return updated user
     */
    public UserDto.Details update(Long id, UpdateUserForm form) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BadRequestException(translate.trans("user.notfound")));
        // Update information
        user.setEmail(form.getEmail());
        user.setFirstName(form.getFirstName());
        user.setLastName(form.getLastName());
        user.setPassword(passwordEncoder.encode(form.getPassword()));
        user.setRoles(form.getRoles());
        user.setEnabled(form.getEnabled());
        user.setTitle(form.getTitle());
        user.setDepartment(form.getDepartment());

        userRepository.save(user);
        return UserDto.Details.newInstance(user);
    }

    /**
     * Delete user
     *
     * @param id user id to delete
     */
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    /**
     * Retrieve use by id
     *
     * @param id user id
     * @return found user
     */
    public UserDto.Details get(Long id) {
        return UserDto.Details.newInstance(
                userRepository.findById(id)
                        .orElseThrow(() -> new BadRequestException(translate.trans("user.notfound")))
        );
    }

    /**
     * Users count by status
     *
     * @return list of statues with counts
     */
    public List<GroupedResult> counts() {
        return userRepository.countByStatus();
    }
}
