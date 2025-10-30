package td.aboudev.access_requester.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import td.aboudev.access_requester.entities.Delegation;
import td.aboudev.access_requester.entities.User;
import td.aboudev.access_requester.exceptions.BadRequestException;
import td.aboudev.access_requester.models.PageModel;
import td.aboudev.access_requester.models.dtos.UserDelegationsDto;
import td.aboudev.access_requester.models.dtos.UserDto;
import td.aboudev.access_requester.models.forms.DelegationForm;
import td.aboudev.access_requester.repositories.DelegationRepository;

import java.time.LocalDate;
import java.util.Collections;


@Service
@RequiredArgsConstructor
public class DelegationService {
    private final UserService userService;
    private final SecurityService securityService;
    private final DelegationRepository delegationRepository;
    private final TranslationService translate;

    /**
     * List of all active users for admin and only current user otherwise
     *
     * @param search   Search key
     * @param pageable List pageable
     * @return Users page model
     */
    public PageModel<UserDto.List> list(String search, Pageable pageable) {
        User currntUser = securityService.getCurrentUser();
        if (currntUser.getRoles().contains("ADMIN")) {
            return userService.activeList(search, pageable);
        }
        return new PageModel<>(
                new PageImpl<>(Collections.singletonList(currntUser), pageable, 1)
                        .map(UserDto.List::newInstance)
        );
    }

    public UserDelegationsDto getUserDelegation(Long userId) {
        User user = userService.getUser(userId);
        return UserDelegationsDto.newInstance(user);
    }

    /**
     * Create a delegation
     *
     * @param userId User id
     * @param form   Delegation form
     * @return updated user delegations
     */
    public UserDelegationsDto create(Long userId, DelegationForm form) {
        User user = userService.getUser(userId);
        User delegatedUser = userService.getUser(form.getDelegatedUserId());
        if (user.getId().equals(delegatedUser.getId())) {
            throw new BadRequestException(translate.trans("delegations.same_user"));
        }
        // Validate date
        Delegation delegation = Delegation.builder()
                .user(user)
                .delegatedUser(delegatedUser)
                .startDate(form.getStartDate())
                .endDate(form.getEndDate())
                .build();
        delegationRepository.save(delegation);
        user.getDelegations().add(delegation);
        return UserDelegationsDto.newInstance(user);
    }

    /**
     * Delete delegation
     *
     * @param id Delegation id
     */
    public void delete(Long id) {
        // Check if delegation is deletable
        Delegation delegation = delegationRepository.findById(id);
        if (delegation != null) {
            if (delegation.getEndDate().isBefore(LocalDate.now())) {
                throw new BadRequestException(translate.trans("delegations.not_deletable"));
            }
            delegationRepository.deleteById(id);
        }
    }
}
